import { defaultClasses, DocumentType, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

import { User } from '../../types/index.js';
import { ArticleEntity } from '../article/article.entity.js';
import { DEFAULT_AVATAR_FILE_NAME, SALT_ROUNDS } from './user.constant.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    unique: true,
    required: true,
    lowercase: true,
    trim: true,
  })
  public username: string;

  @prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  public email: string;

  @prop({
    default: DEFAULT_AVATAR_FILE_NAME,
  })
  public image: string;

  @prop({
    default: null,
    trim: true,
  })
  public bio: string;

  @prop({
    ref: UserEntity,
    type: String,
    default: [],
  })
  public followingUsers: Ref<UserEntity, string>[];

  @prop({
    ref: ArticleEntity,
    type: String,
    default: [],
  })
  public favoritedArticles: Ref<ArticleEntity, string>[];

  @prop({
    required: true,
  })
  private password?: string;

  constructor(userData: User) {
    super();

    this.username = userData.username;
    this.email = userData.email;
  }

  public async setPassword(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }

  public async followUser(this: DocumentType<UserEntity>, userId: string): Promise<void> {
    this.followingUsers.push(userId);
    await this.save();
  }

  public async unfollowUser(this: DocumentType<UserEntity>, userId: string): Promise<void> {
    this.followingUsers = this.followingUsers.filter((followingUserId) => followingUserId !== userId);
    await this.save();
  }

  public async isFollowing(this: DocumentType<UserEntity>, userId: string): Promise<boolean> {
    return this.followingUsers.includes(userId);
  }

  public async favoriteArticle(this: DocumentType<UserEntity>, articleId: string): Promise<void> {
    this.favoritedArticles.push(articleId);
    await this.save();
  }

  public async unfavoriteArticle(this: DocumentType<UserEntity>, articleId: string): Promise<void> {
    this.favoritedArticles = this.favoritedArticles.filter((favoriteArticle) => favoriteArticle !== articleId);
    await this.save();
  }

  public async isFavorite(this: DocumentType<UserEntity>, articleId: string): Promise<boolean> {
    return this.favoritedArticles.includes(articleId);
  }
}

export const UserModel = getModelForClass(UserEntity);
