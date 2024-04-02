import { DocumentType } from '@typegoose/typegoose';
import { DocumentExistsService } from 'shared/types/document-exists-service.interface.js';

import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

export interface CommentService extends DocumentExistsService {
  findByArticleId(articleId: string): Promise<DocumentType<CommentEntity>[]>;
  create(dto: CreateCommentDto['comment']): Promise<DocumentType<CommentEntity>>;
  deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null>;
  deleteByArticleId(articleId: string): Promise<number | null>;
}
