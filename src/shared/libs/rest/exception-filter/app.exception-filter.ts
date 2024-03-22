import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { createErrorObject } from '../../../helpers/common.js';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../logger/logger.interface.js';
import { HttpError } from '../index.js';
import { ApplicationError } from '../types/application-error.enum.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error | HttpError, req: Request, res: Response, _next: NextFunction): void {
    this.logger.error(error.message, error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
