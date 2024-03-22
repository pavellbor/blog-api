import { Expose, Type } from 'class-transformer';

import { UserRdo } from '../../user/rdo/user.rdo.js';

export class CommentRdo {
  @Expose()
  public id: string;

  @Expose()
  public body: string;

  @Expose()
  public createdAt: string;

  @Expose()
  public updatedAt: string;

  @Expose({
    name: 'userId',
  })
  @Type(() => UserRdo)
  public author: UserRdo;
}
