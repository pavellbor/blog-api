import { Request } from 'express';
import { ArticleIdParam } from './article-id-param.type.js';

export type DeleteArticleRequest = Request<ArticleIdParam>;
