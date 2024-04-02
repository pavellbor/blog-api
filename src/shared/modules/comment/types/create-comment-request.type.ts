import { Request } from 'express';
import { ArticleSlugParam } from 'shared/modules/article/types/article-slug-param.type.js';

import { CreateCommentDto } from '../dto/create-comment.dto.js';

export type CreateCommentRequest = Request<ArticleSlugParam, unknown, CreateCommentDto>;
