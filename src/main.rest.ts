import 'reflect-metadata';
import { Container } from 'inversify';
import { RestApplication, createRestContainer } from './rest/index.js';
import { Component } from './shared/types/index.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { createArticleContainer } from './shared/modules/article/article.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createAuthContainer } from './shared/modules/auth/auth.container.js';

function bootstrap() {
  const container = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createArticleContainer(),
    createCommentContainer(),
    createAuthContainer(),
  );

  const application = container.get<RestApplication>(Component.RestApplication);
  application.init();
}

bootstrap();
