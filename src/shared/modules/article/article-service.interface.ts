import { DocumentType } from '@typegoose/typegoose';

import { DocumentExistsService } from '../../types/document-exists-service.interface.js';
import { ArticleEntity } from './article.entity.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { FindRequestQuery } from './types/find-request-query.type.js';

export interface ArticleService extends DocumentExistsService {
  find(params: FindRequestQuery): Promise<DocumentType<ArticleEntity>[]>;
  findById(articleId: string): Promise<DocumentType<ArticleEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<ArticleEntity> | null>;
  create(dto: CreateArticleDto): Promise<DocumentType<ArticleEntity>>;
  updateById(articleId: string, dto: UpdateArticleDto): Promise<DocumentType<ArticleEntity>>;
  deleteById(articleId: string): Promise<DocumentType<ArticleEntity> | null>;
  getTotalCount(): Promise<number>;
}
