import cors from 'cors';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { getFullServerPath } from '../shared/helpers/common.js';
import { Config } from '../shared/libs/config/index.js';
import { RestSchema } from '../shared/libs/config/rest.schema.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Controller, ExceptionFilter } from '../shared/libs/rest/index.js';
import { ParseTokenMiddleware } from '../shared/libs/rest/middleware/parse-token.middleware.js';
import { Component } from '../shared/types/index.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from './rest.constant.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.ArticleController)
    private readonly articleController: Controller,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.AppExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDatabase() {
    return this.databaseClient.connect(this.config.get('DB_URI'));
  }

  private async initMiddleware() {
    this.server.use(express.json());
    this.server.use(STATIC_UPLOAD_ROUTE, express.static(this.config.get('UPLOAD_DIRECTORY')));
    this.server.use(STATIC_FILES_ROUTE, express.static(this.config.get('STATIC_DIRECTORY_PATH')));

    const jwtSecret = this.config.get('JWT_SECRET');
    const authenticateMiddleware = new ParseTokenMiddleware(jwtSecret);
    this.server.use(authenticateMiddleware.execute.bind(authenticateMiddleware));

    this.server.use(cors());
  }

  private async initExceptionFilter() {
    this.server.use(this.authExceptionFilter.catch.bind(this.authExceptionFilter));
    this.server.use(this.validationExceptionFilter.catch.bind(this.validationExceptionFilter));
    this.server.use(this.httpExceptionFilter.catch.bind(this.httpExceptionFilter));
    this.server.use(this.appExceptionFilter.catch.bind(this.appExceptionFilter));
  }

  private async initControllers() {
    this.server.use('/users', this.userController.router);
    this.server.use('/articles', this.articleController.router);
  }

  private async initServer() {
    const port = this.config.get('PORT');
    this.server.listen(port);
  }

  public async init() {
    this.logger.info('Initializing the database...');
    await this.initDatabase();
    this.logger.info('The database is initialized');

    this.logger.info('Initializing the app-level middleware...');
    await this.initMiddleware();
    this.logger.info('The app-level middleware is initialized');

    this.logger.info('Initializing controllers...');
    await this.initControllers();
    this.logger.info('The controllers are initialized');

    this.logger.info('Initializing the exception filter...');
    await this.initExceptionFilter();
    this.logger.info('The exception filter is initialized');

    this.logger.info(`Starting the server on port ${this.config.get('PORT')}...`);
    await this.initServer();
    this.logger.info(`The server is running on ${getFullServerPath(this.config.get('HOST'), this.config.get('PORT'))}`);
  }
}
