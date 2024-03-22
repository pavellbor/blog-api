import { Request } from 'express';

import { ArticleIdParam } from '../../article/types/article-id-param.type.js';
import { CreateCommentDto } from '../dto/create-comment.dto.js';

export type CreateCommentRequest = Request<ArticleIdParam, unknown, Omit<CreateCommentDto, 'articleId'>>;
