import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import {
  BaseController,
  CheckDocumentExistsMiddleware,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ArticleService } from '../article/article-service.interface.js';
import { UserService } from '../user/index.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';
import { MultipleCommentsRdo } from './rdo/multiple-comments.rdo.js';
import { SingleCommentRdo } from './rdo/single-comment.rdo.js';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import { DeleteCommentRequest } from './types/delete-comment-request.type copy.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.ArticleService) private readonly articleService: ArticleService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
    @inject(Component.UserService)
    private readonly userService: UserService,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(this.userService), new ValidateDtoMiddleware(CreateCommentDto)],
    });
    this.addRoute({
      path: '/:commentId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new ValidateObjectIdMiddleware('commentId'),
        new CheckDocumentExistsMiddleware(this.commentService, 'commentId'),
      ],
    });
  }

  async index(req: Request, res: Response, _next: NextFunction) {
    const article = await this.articleService.findBySlug(req.params.articleSlug);
    const comments = await this.commentService.findByArticleId(article.id);

    for (const comment of comments) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      comment.userId.following = req.tokenPayload?.id
        ? await this.userService.isFollowing(req.tokenPayload.id, comment.userId._id.toString())
        : false;
    }

    this.ok(res, fillDTO(MultipleCommentsRdo, { comments }));
  }

  async create(req: CreateCommentRequest, res: Response, _next: NextFunction) {
    const article = await this.articleService.findBySlug(req.params.articleSlug);

    const createCommentPayload = { ...req.body.comment, userId: req.tokenPayload.id, articleId: article.id };
    const comment = await this.commentService.create(createCommentPayload);

    this.created(res, fillDTO(SingleCommentRdo, { comment }));
  }

  async delete(req: DeleteCommentRequest, res: Response, _next: NextFunction) {
    await this.commentService.deleteById(req.params.commentId);

    this.noContent(res);
  }
}
