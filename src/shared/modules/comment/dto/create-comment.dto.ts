import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';

import { CommentDto } from './comment.dto.js';
import { CreateCommentMessage } from './create-comment.messages.js';

export class CreateCommentDto {
  @Type(() => CommentDto)
  @ValidateNested()
  @IsObject({ message: CreateCommentMessage.comment.invalidFormat })
  comment: Pick<CommentDto, 'body'>;
}
