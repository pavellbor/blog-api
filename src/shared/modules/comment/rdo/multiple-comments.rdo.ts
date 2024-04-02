import { Expose, Type } from 'class-transformer';

import { CommentRdo } from './comment.rdo.js';

export class MultipleCommentsRdo {
  @Expose()
  @Type(() => CommentRdo)
  public comments: CommentRdo[];
}
