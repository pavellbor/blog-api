import { ReturnModelType } from '@typegoose/typegoose';
import { Container } from 'inversify';

import { Controller } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { ProfilesController, UserController, UsersController } from './controller/index.js';
import { DefaultUserService } from './default-user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { UserService } from './user-service.interface.js';

export function createUserContainer(): Container {
  const container = new Container();

  container.bind<Controller>(Component.UserController).to(UserController).inSingletonScope();
  container.bind<Controller>(Component.UsersController).to(UsersController).inSingletonScope();
  container.bind<Controller>(Component.ProfilesController).to(ProfilesController).inSingletonScope();
  container.bind<ReturnModelType<typeof UserEntity>>(Component.UserModel).toConstantValue(UserModel);
  container.bind<UserService>(Component.UserService).to(DefaultUserService).inSingletonScope();

  return container;
}
