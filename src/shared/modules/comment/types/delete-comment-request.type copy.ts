import { Request } from 'express';
import { ArticleSlugParam } from 'shared/modules/article/types/article-slug-param.type.js';

import { CommentIdParam } from './comment-id-param.type.js';

export type DeleteCommentRequest = Request<ArticleSlugParam & CommentIdParam>;
