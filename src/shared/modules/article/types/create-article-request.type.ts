import { Request } from 'express';
import { CreateArticleDto } from '../dto/create-article.dto.js';

export type CreateArticleRequest = Request<unknown, unknown, CreateArticleDto>;
