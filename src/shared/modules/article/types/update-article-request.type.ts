import { Request } from 'express';

import { UpdateArticleDto } from '../dto/update-article.dto.js';
import { ArticleIdParam } from './article-id-param.type.js';

export type UpdateArticleRequest = Request<ArticleIdParam, unknown, UpdateArticleDto>;
