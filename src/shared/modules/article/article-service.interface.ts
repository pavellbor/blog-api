import { DocumentType } from '@typegoose/typegoose';

import { DocumentExistsService } from '../../types/document-exists-service.interface.js';
import { ArticleEntity } from './article.entity.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { FindArticlesParams } from './types/find-articles-params.type.js';
import { FindFeedArticlesParams } from './types/find-feed-articles-params.type.js';

export interface ArticleService extends DocumentExistsService {
  find(params: FindArticlesParams): Promise<{ data: DocumentType<ArticleEntity>[]; count: number }>;
  findFeed(
    followingUsersIds: string[],
    params: FindFeedArticlesParams,
  ): Promise<{ data: DocumentType<ArticleEntity>[]; count: number }>;
  findById(articleId: string): Promise<DocumentType<ArticleEntity> | null>;
  findBySlug(slug: string): Promise<DocumentType<ArticleEntity> | null>;
  findByTitle(title: string): Promise<DocumentType<ArticleEntity> | null>;
  create(dto: CreateArticleDto['article']): Promise<DocumentType<ArticleEntity>>;
  updateBySlug(articleSlug: string, dto: UpdateArticleDto['article']): Promise<DocumentType<ArticleEntity>>;
  deleteBySlug(articleSlug: string): Promise<DocumentType<ArticleEntity> | null>;
}
