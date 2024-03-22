import { defaultClasses, getModelForClass, modelOptions, prop, Ref } from '@typegoose/typegoose';
import { Article } from 'shared/types/article.type.js';

import { UserEntity } from '../user/user.entity.js';

export interface ArticleEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'articles',
  },
})
export class ArticleEntity extends defaultClasses.TimeStamps implements Partial<Article> {
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
  tagList?: string[];

  @prop({
    required: true,
    ref: UserEntity,
  })
  userId: Ref<UserEntity>;
}

export const ArticleModel = getModelForClass(ArticleEntity);
