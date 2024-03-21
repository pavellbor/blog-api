import { Ref, defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import { UserEntity } from '../user/user.entity.js';
import { ArticleEntity } from '../article/article.entity.js';

export interface CommentEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'comments',
  },
})
export class CommentEntity extends defaultClasses.TimeStamps {
  @prop({
    required: true,
  })
  body: string;

  @prop({
    required: true,
    ref: ArticleEntity,
  })
  articleId: Ref<ArticleEntity>;

  @prop({
    required: true,
    ref: UserEntity,
  })
  userId: Ref<UserEntity>;
}

export const CommentModel = getModelForClass(CommentEntity);
