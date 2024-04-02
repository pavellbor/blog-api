import { Container } from 'inversify';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { DefaultTagService } from './default-tag.service.js';
import { TagController } from './tag.controller.js';
import { TagService } from './tag-service.interface.js';

export function createTagContainer(): Container {
  const container = new Container();

  container.bind<TagService>(Component.TagService).to(DefaultTagService).inSingletonScope();
  container.bind<Controller>(Component.TagController).to(TagController).inSingletonScope();

  return container;
}
