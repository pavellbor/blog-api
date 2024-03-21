import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../index.js';
import { StatusCodes } from 'http-status-codes';

export class PrivateRouteMiddleware implements Middleware {
  public execute({ tokenPayload }: Request, res: Response, next: NextFunction): void {
    if (!tokenPayload) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware');
    }

    return next();
  }
}
