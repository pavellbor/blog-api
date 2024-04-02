import { defaultClasses, DocumentType, getModelForClass, modelOptions, pre, prop, Ref } from '@typegoose/typegoose';
import { Article } from 'shared/types/article.type.js';
// eslint-disable-next-line import/no-extraneous-dependencies
import getSlug from 'speakingurl';

import { UserEntity } from '../user/user.entity.js';

export interface ArticleEntity extends defaultClasses.Base {}

@pre<ArticleEntity>('save', function (next) {
  this.slug = getSlug(this.title);
  next();
})
@pre<ArticleEntity>('findOneAndUpdate', function (next) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  if (this._update.title) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    this._update.slug = getSlug(this._update.title);
  }
  next();
})
@modelOptions({
  schemaOptions: {
    collection: 'articles',
  },
})
export class ArticleEntity extends defaultClasses.TimeStamps implements Partial<Article> {
  @prop({
    unique: true,
    lowercase: true,
    index: true,
  })
  slug: string;

  @prop({
    required: true,
    trim: true,
  })
  title: string;

  @prop({
    required: true,
    trim: true,
  })
  description: string;

  @prop({
    required: true,
    trim: true,
  })
  body: string;

  @prop({
    default: [],
  })
  tagList: string[];

  @prop({
    required: true,
    ref: 'UserEntity',
  })
  userId: Ref<UserEntity>;

  @prop({
    default: 0,
  })
  favoritesCount: number;

  public async incrementFavoritesCount(this: DocumentType<ArticleEntity>): Promise<void> {
    this.favoritesCount++;
    await this.save();
  }

  public async decrementFavoritesCount(this: DocumentType<ArticleEntity>): Promise<void> {
    if (this.favoritesCount <= 0) {
      return;
    }

    this.favoritesCount--;
    await this.save();
  }
}

export const ArticleModel = getModelForClass(ArticleEntity);
