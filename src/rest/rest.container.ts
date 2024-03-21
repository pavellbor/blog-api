import { Container } from 'inversify';
import { RestApplication } from './rest.application.js';
import { Component } from '../shared/types/component.enum.js';
import { Logger } from '../shared/libs/logger/logger.interface.js';
import { Config } from '../shared/libs/config/config.interface.js';
import { DatabaseClient } from '../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../shared/libs/database-client/mongo.database-client.js';
import {
  ExceptionFilter,
  AppExceptionFilter,
  ValidationExceptionFilter,
  HttpErrorExceptionFilter,
} from '../shared/libs/rest/index.js';
import { PinoLogger } from '../shared/libs/logger/pino.logger.js';
import { RestConfig } from '../shared/libs/config/rest.config.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { PathTransformer } from '../shared/libs/rest/transformer/path-transformer.js';

export function createRestContainer(): Container {
  const container = new Container();

  container.bind<RestApplication>(Component.RestApplication).to(RestApplication).inSingletonScope();
  container.bind<Logger>(Component.Logger).to(PinoLogger).inSingletonScope();
  container.bind<Config<RestSchema>>(Component.Config).to(RestConfig).inSingletonScope();
  container.bind<DatabaseClient>(Component.DatabaseClient).to(MongoDatabaseClient).inSingletonScope();
  container.bind<ExceptionFilter>(Component.AppExceptionFilter).to(AppExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilter>(Component.HttpExceptionFilter).to(HttpErrorExceptionFilter).inSingletonScope();
  container.bind<ExceptionFilter>(Component.ValidationExceptionFilter).to(ValidationExceptionFilter).inSingletonScope();
  container.bind<PathTransformer>(Component.PathTransformer).to(PathTransformer).inSingletonScope();

  return container;
}
