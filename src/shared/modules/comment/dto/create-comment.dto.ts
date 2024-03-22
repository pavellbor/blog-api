import { IsString, Length } from 'class-validator';

import { CreateCommentMessage } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentMessage.body.invalidFormat })
  @Length(5, 1024, { message: CreateCommentMessage.body.length })
  body: string;

  articleId: string;

  userId: string;
}
