import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/rdo/user.rdo.js';

export class ArticleRdo {
  @Expose({
    name: '_id'
  })
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  tagList: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose({
    name: 'userId',
  })
  @Type(() => UserRdo)
  author: UserRdo;
}
