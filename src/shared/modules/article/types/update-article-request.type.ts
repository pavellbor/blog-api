import { Request } from 'express';
import { ArticleIdParam } from './article-id-param.type.js';
import { UpdateArticleDto } from '../dto/update-article.dto.js';

export type UpdateArticleRequest = Request<ArticleIdParam, unknown, UpdateArticleDto>;
