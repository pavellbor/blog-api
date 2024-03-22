import { NextFunction, Response } from 'express';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  CheckDocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { Component } from '../../types/component.enum.js';
import { CommentController } from '../comment/comment.controller.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { ArticleService } from './article-service.interface.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { ArticleRdo } from './rdo/article.rdo.js';
import { CreateArticleRequest } from './types/create-article-request.type.js';
import { DeleteArticleRequest } from './types/delete-article-request.js';
import { IndexArticlesRequest } from './types/index-articles-request.type.js';
import { ShowArticleRequest } from './types/show-article-request.type.js';
import { UpdateArticleRequest } from './types/update-article-request.type.js';

@injectable()
export class ArticleController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ArticleService)
    private readonly articleService: ArticleService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.CommentController) private readonly commentController: CommentController,
  ) {
    super(logger);

    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateArticleDto)],
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index,
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/:articleId',
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('articleId'),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleId'),
      ],
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/:articleId',
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('articleId'),
        new ValidateDtoMiddleware(UpdateArticleDto),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleId'),
      ],
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:articleId',
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('articleId'),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleId'),
      ],
    });
    this.addController({
      path: '/:articleId/comments',
      router: this.commentController.router,
      middlewares: [
        new ValidateObjectIdMiddleware('articleId'),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleId'),
      ],
    });
  }

  public async create(req: CreateArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.create({ ...req.body, userId: req.tokenPayload.id });

    this.created(res, fillDTO(ArticleRdo, article));
  }

  public async index(req: IndexArticlesRequest, res: Response, _next: NextFunction): Promise<void> {
    const articles = await this.articleService.find(req.query);

    this.ok(res, fillDTO(ArticleRdo, articles));
  }

  public async show(req: ShowArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.findById(req.params.articleId);

    this.ok(res, fillDTO(ArticleRdo, article));
  }

  public async update(req: UpdateArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const updatedArticle = await this.articleService.updateById(req.params.articleId, req.body);

    this.ok(res, fillDTO(ArticleRdo, updatedArticle));
  }

  public async delete(req: DeleteArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const deletedArticle = await this.articleService.deleteById(req.params.articleId);

    await this.commentService.deleteByArticleId(req.params.articleId);

    this.noContent(res, deletedArticle);
  }
}
