import { defaultClasses, DocumentType, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

import { User } from '../../types/index.js';
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
}

export const UserModel = getModelForClass(UserEntity);
