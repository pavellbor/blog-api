import 'reflect-metadata';

import { Container } from 'inversify';

import { createRestContainer, RestApplication } from './rest/index.js';
import { createArticleContainer } from './shared/modules/article/article.container.js';
import { createAuthContainer } from './shared/modules/auth/auth.container.js';
import { createCommentContainer } from './shared/modules/comment/comment.container.js';
import { createTagContainer } from './shared/modules/tag/tag.container.js';
import { createUserContainer } from './shared/modules/user/index.js';
import { Component } from './shared/types/index.js';

function bootstrap() {
  const container = Container.merge(
    createRestContainer(),
    createUserContainer(),
    createArticleContainer(),
    createCommentContainer(),
    createAuthContainer(),
    createTagContainer(),
  );

  const application = container.get<RestApplication>(Component.RestApplication);
  application.init();
}

bootstrap();
