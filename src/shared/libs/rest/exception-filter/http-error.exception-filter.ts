import { Request, Response, NextFunction } from 'express';
import { ExceptionFilter } from './exception-filter.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../../types/component.enum.js';
import { Logger } from '../../logger/logger.interface.js';
import { createErrorObject } from '../../../helpers/common.js';
import { HttpError } from '../index.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(error: Error | HttpError, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    const fullPath = req.baseUrl + req.path;

    this.logger.error(`[HttpErrorException]: ${fullPath} # ${error.message}`, error);

    res.status(error.httpStatusCode).json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
