/* eslint-disable @typescript-eslint/no-explicit-any */
import { DocumentType } from '@typegoose/typegoose';
import { NextFunction, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  CheckDocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
} from '../../libs/rest/index.js';
import { ValidateDtoMiddleware } from '../../libs/rest/middleware/validate-dto.middleware.js';
import { Component } from '../../types/component.enum.js';
import { CommentController } from '../comment/comment.controller.js';
import { CommentService } from '../comment/comment-service.interface.js';
import { UserService } from '../user/user-service.interface.js';
import { ArticleEntity } from './article.entity.js';
import { ArticleService } from './article-service.interface.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { MultipleArticlesRdo } from './rdo/multiple-articles.rdo.js';
import { SingleArticleRdo } from './rdo/single-article.rdo.js';
import { CreateArticleRequest } from './types/create-article-request.type.js';
import { DeleteArticleRequest } from './types/delete-article-request.js';
import { GetFeedArticlesRequest } from './types/get-feed-articles-request.type.js';
import { IndexArticlesRequest } from './types/index-articles-request.type.js';
import { ShowArticleRequest } from './types/show-article-request.type.js';
import { UpdateArticleRequest } from './types/update-article-request.type.js';

@injectable()
export class ArticleController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ArticleService)
    private readonly articleService: ArticleService,
    @inject(Component.UserService)
    private readonly userService: UserService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.CommentController) private readonly commentController: CommentController,
  ) {
    super(logger);

    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index,
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/feed',
      handler: this.getFeed,
      middlewares: [new PrivateRouteMiddleware(this.userService)],
    });
    this.addRoute({
      method: HttpMethod.Get,
      path: '/:articleSlug',
      handler: this.show,
      middlewares: [new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug')],
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(this.userService), new ValidateDtoMiddleware(CreateArticleDto)],
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/:articleSlug',
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateDtoMiddleware(UpdateArticleDto),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug'),
      ],
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:articleSlug',
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug'),
      ],
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:articleSlug/favorite',
      handler: this.favorite,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug'),
      ],
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:articleSlug/favorite',
      handler: this.unfavorite,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug'),
      ],
    });
    this.addController({
      path: '/:articleSlug/comments',
      router: this.commentController.router,
      middlewares: [new CheckDocumentExistsMiddleware(this.articleService, 'articleSlug')],
    });
  }

  private async fillArticlePrivateFields(userId: string, article: DocumentType<ArticleEntity>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    article.userId.following = userId
      ? await this.userService.isFollowing(userId, article.userId._id.toString())
      : false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    article.favorited = userId ? await this.userService.isFavorite(userId, article._id.toString()) : false;
  }

  public async index(req: IndexArticlesRequest, res: Response, _next: NextFunction): Promise<void> {
    const result = await this.articleService.find({
      ...req.query,
      limit: req.query.limit && Number(req.query.limit),
      offset: req.query.offset && Number(req.query.offset),
    });

    for (const article of result.data) {
      await this.fillArticlePrivateFields(req.tokenPayload?.id, article);
    }

    this.ok(res, fillDTO(MultipleArticlesRdo, result));
  }

  public async getFeed(req: GetFeedArticlesRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await this.userService.findById(req.tokenPayload.id);
    const result = await this.articleService.findFeed(user.followingUsers as string[], {
      limit: req.query.limit && Number(req.query.limit),
      offset: req.query.offset && Number(req.query.offset),
    });

    for (const article of result.data) {
      await this.fillArticlePrivateFields(req.tokenPayload?.id, article);
    }

    this.ok(res, fillDTO(MultipleArticlesRdo, result));
  }

  public async show(req: ShowArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.findBySlug(req.params.articleSlug);

    this.ok(res, fillDTO(SingleArticleRdo, { article }));
  }

  public async create(req: CreateArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.create({ ...req.body.article, userId: req.tokenPayload.id });

    await this.fillArticlePrivateFields(req.tokenPayload?.id, article);

    this.created(res, fillDTO(SingleArticleRdo, { article }));
  }

  public async update(req: UpdateArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.updateBySlug(req.params.articleSlug, req.body.article);

    await this.fillArticlePrivateFields(req.tokenPayload?.id, article);

    this.ok(res, fillDTO(SingleArticleRdo, { article }));
  }

  public async delete(req: DeleteArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    await this.articleService.deleteBySlug(req.params.articleSlug);

    this.noContent(res);
  }

  public async favorite(req: ShowArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.findBySlug(req.params.articleSlug);
    const isFavorite = await this.userService.isFavorite(req.tokenPayload.id, article.id);

    if (isFavorite) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The user is already favorite the article with slug ${article.slug}`,
        'ArticleController',
      );
    }

    await this.userService.favoriteArticle(req.tokenPayload.id, article.id);
    await article.incrementFavoritesCount();
    await this.fillArticlePrivateFields(req.tokenPayload?.id, article);

    this.ok(res, fillDTO(SingleArticleRdo, { article }));
  }

  public async unfavorite(req: ShowArticleRequest, res: Response, _next: NextFunction): Promise<void> {
    const article = await this.articleService.findBySlug(req.params.articleSlug);
    const isFavorite = await this.userService.isFavorite(req.tokenPayload.id, article.id);

    if (!isFavorite) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The user does not favorite the article with slug ${article.slug}`,
        'ArticleController',
      );
    }

    await this.userService.unfavoriteArticle(req.tokenPayload.id, article.id);
    await article.decrementFavoritesCount();
    await this.fillArticlePrivateFields(req.tokenPayload?.id, article);

    this.ok(res, fillDTO(SingleArticleRdo, { article }));
  }
}
