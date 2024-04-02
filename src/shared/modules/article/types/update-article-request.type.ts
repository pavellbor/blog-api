import { Request } from 'express';

import { UpdateArticleDto } from '../dto/update-article.dto.js';
import { ArticleSlugParam } from './article-slug-param.type.js';

export type UpdateArticleRequest = Request<ArticleSlugParam, unknown, UpdateArticleDto>;
