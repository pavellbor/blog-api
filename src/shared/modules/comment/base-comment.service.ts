import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from 'shared/libs/logger/logger.interface.js';

import { Component } from '../../types/component.enum.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment-service.interface.js';
import { CreateCommentDto } from './dto/create-comment.dto.js';

@injectable()
export class BaseCommentService implements CommentService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.CommentModel) private readonly commentModel: ReturnModelType<typeof CommentEntity>,
  ) {}

  public async findByArticleId(articleId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel.find({ articleId }).populate('userId');
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const result = await (await this.commentModel.create(dto)).populate('userId');

    this.logger.info(`A new comment was added: ${result.body}`);

    return result;
  }

  public async deleteById(commentId: string): Promise<DocumentType<CommentEntity> | null> {
    const result = await this.commentModel.findByIdAndDelete(commentId);

    this.logger.info(`The comment has been deleted: ${result.body}`);

    return result;
  }

  public async deleteByArticleId(articleId: string): Promise<number> {
    const result = (await this.commentModel.deleteMany({ articleId })).deletedCount;

    this.logger.info(`${result} comments have been deleted`);

    return result;
  }

  public async exists(documentId: string): Promise<boolean> {
    const result = await this.commentModel.findById(documentId);

    return Boolean(result);
  }
}
