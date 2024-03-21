import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../logger/logger.interface.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/common.js';
import { HttpError } from '../index.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class AppExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register AppExceptionFilter');
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    this.logger.error(error.message, error);

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(createErrorObject(ApplicationError.ServiceError, error.message));
  }
}
