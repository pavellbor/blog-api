import { Request } from 'express';

import { ArticleIdParam } from '../../article/types/article-id-param.type.js';
import { CommentIdParam } from './comment-id-param.type.js';

export type DeleteCommentRequest = Request<ArticleIdParam & CommentIdParam>;
