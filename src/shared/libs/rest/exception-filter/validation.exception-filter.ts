import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { Logger } from '../../../libs/logger/logger.interface.js';
import { Component } from '../../../types/component.enum.js';
import { ValidationError } from '../index.js';
import { ExceptionFilter } from './exception-filter.interface.js';

@injectable()
export class ValidationExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register ValidationExceptionFilter');
  }

  catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[ValidationExceptionFilter]: ${error.message}`, error);

    error.details.forEach(({ property, messages }) => this.logger.warn(`[${property}] – ${messages}`));

    res.status(error.httpStatusCode).send(error.details);
  }
}
