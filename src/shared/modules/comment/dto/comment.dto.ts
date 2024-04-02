import { IsOptional, IsString, Length } from 'class-validator';

import { CreateCommentMessage } from './create-comment.messages.js';

export class CommentDto {
  @IsString({ message: CreateCommentMessage.body.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessage.body.length })
  body: string;

  @IsOptional()
  articleId: string;

  @IsOptional()
  userId: string;
}
