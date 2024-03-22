import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { createErrorObject } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { ApplicationError } from '../../libs/rest/types/application-error.enum.js';
import { Component } from '../../types/component.enum.js';
import { BaseUserException } from './errors/base-user.exception.js';

@injectable()
export class AuthExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof BaseUserException)) {
      return next(error);
    }

    this.logger.error(`[AuthModule] ${error.message}`, error);

    res.status(error.httpStatusCode).json(createErrorObject(ApplicationError.AuthorizationError, error.message));
  }
}
