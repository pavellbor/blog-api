import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { Types } from 'mongoose';
import { HttpError } from '../index.js';
import { StatusCodes } from 'http-status-codes';

export class ValidateObjectIdMiddleware implements Middleware {
  constructor(private readonly param: string) {}

  public execute({ params }: Request, res: Response, next: NextFunction): void {
    const objectId = params[this.param];

    if (Types.ObjectId.isValid(objectId)) {
      return next();
    }

    throw new HttpError(StatusCodes.BAD_REQUEST, `${objectId} is invalid ObjectId`, 'ValidateObjectIdMiddleware');
  }
}
