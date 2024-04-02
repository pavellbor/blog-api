import { Expose, Type } from 'class-transformer';

import { CommentRdo } from './comment.rdo.js';

export class SingleCommentRdo {
  @Expose()
  @Type(() => CommentRdo)
  public comment: CommentRdo;
}
