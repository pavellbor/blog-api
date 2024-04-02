import { Request } from 'express';

import { ArticleSlugParam } from './article-slug-param.type.js';

export type DeleteArticleRequest = Request<ArticleSlugParam>;
