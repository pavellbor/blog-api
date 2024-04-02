import { Response, Router } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { Logger } from '../../../../shared/libs/logger/index.js';
import { Component } from '../../../../shared/types/component.enum.js';
import { PathTransformer } from '../transformer/path-transformer.js';
import { InnerController } from '../types/inner-controller.type.js';
import { Route } from '../types/route.type.js';
import { Controller } from './controller.interface.js';

@injectable()
export class BaseController implements Controller {
  private readonly _router: Router;

  @inject(Component.PathTransformer)
  private pathTransformer: PathTransformer;

  constructor(protected readonly logger: Logger) {
    this._router = Router({ mergeParams: true });
  }

  get router() {
    return this._router;
  }

  public addController(controller: InnerController) {
    const middlewareHandlers = controller.middlewares?.map((item) => asyncHandler(item.execute.bind(item)));

    this._router.use(controller.path, ...(middlewareHandlers || []), controller.router);
  }

  public addRoute(route: Route): void {
    const middlewareHandlers = route.middlewares?.map((item) => asyncHandler(item.execute.bind(item)));
    const wrappedHandler = asyncHandler(route.handler.bind(this));

    const allHandlers = middlewareHandlers ? [...middlewareHandlers, wrappedHandler] : wrappedHandler;

    this._router[route.method](route.path, allHandlers);
    this.logger.info(`Route registered: ${route.method.toUpperCase()} ${route.path}`);
  }

  public async send<T>(res: Response, statusCode: number, data?: T): Promise<void> {
    const modifiedData = await this.pathTransformer.execute(data as Record<string, unknown>);
    res.status(statusCode).json(modifiedData);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent(res: Response): void {
    this.send(res, StatusCodes.NO_CONTENT);
  }

  public conflict<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CONFLICT, data);
  }
}
