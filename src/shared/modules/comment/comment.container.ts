import { Container } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import { BaseCommentService } from './base-comment.service.js';
import { CommentController } from './comment.controller.js';
import { ReturnModelType } from '@typegoose/typegoose';
import { Controller } from '../../libs/rest/index.js';
import { CommentService } from './comment-service.interface.js';

export function createCommentContainer() {
  const container = new Container();

  container.bind<ReturnModelType<typeof CommentEntity>>(Component.CommentModel).toConstantValue(CommentModel);
  container.bind<CommentService>(Component.CommentService).to(BaseCommentService).inSingletonScope();
  container.bind<Controller>(Component.CommentController).to(CommentController).inSingletonScope();

  return container;
}
