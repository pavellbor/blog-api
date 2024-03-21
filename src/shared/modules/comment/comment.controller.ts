import { inject, injectable } from 'inversify';
import { Logger } from '../../libs/logger/logger.interface.js';
import {
  BaseController,
  CheckDocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { CommentService } from './comment-service.interface.js';
import { NextFunction, Request, Response } from 'express';
import { fillDTO } from '../../helpers/common.js';
import { CommentRdo } from './rdo/comment.rdo.js';
import { StatusCodes } from 'http-status-codes';
import { CreateCommentRequest } from './types/create-comment-request.type.js';
import { DeleteCommentRequest } from './types/delete-comment-request.type copy.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.addRoute({ path: '/', method: HttpMethod.Get, handler: this.index });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new PrivateRouteMiddleware(), new ValidateDtoMiddleware(CreateCommentDto)],
    });
    this.addRoute({
      path: '/:commentId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('commentId'),
        new CheckDocumentExistsMiddleware(this.commentService, 'commentId'),
      ],
    });
  }

  async index(req: Request, res: Response, next: NextFunction) {
    const comments = await this.commentService.findByArticleId(req.params.articleId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }

  async create(req: CreateCommentRequest, res: Response, next: NextFunction) {
    const createCommentPayload = { body: req.body.body, userId: req.tokenPayload.id, articleId: req.params.articleId };
    const comment = await this.commentService.create(createCommentPayload);

    this.created(res, fillDTO(CommentRdo, comment));
  }

  async delete(req: DeleteCommentRequest, res: Response, next: NextFunction) {
    const deletedComment = await this.commentService.deleteById(req.params.commentId);

    this.noContent(res, fillDTO(CommentRdo, deletedComment));
  }
}
