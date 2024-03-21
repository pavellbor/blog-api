import { ReturnModelType } from '@typegoose/typegoose';
import { Container } from 'inversify';
import { ArticleEntity, ArticleModel } from './article.entity.js';
import { Component } from '../../types/component.enum.js';
import { ArticleService } from './article-service.interface.js';
import { BaseArticleService } from './base-article.service.js';
import { Controller } from '../../libs/rest/index.js';
import { ArticleController } from './article.controller.js';

export function createArticleContainer(): Container {
  const container = new Container();

  container.bind<ReturnModelType<typeof ArticleEntity>>(Component.ArticleModel).toConstantValue(ArticleModel);
  container.bind<ArticleService>(Component.ArticleService).to(BaseArticleService).inSingletonScope();
  container.bind<Controller>(Component.ArticleController).to(ArticleController).inSingletonScope();

  return container;
}
