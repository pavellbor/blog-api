import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { UserService } from '../../../modules/user/user-service.interface.js';
import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

export class PrivateRouteMiddleware implements Middleware {
  constructor(private readonly userService: UserService) {}

  public async execute({ tokenPayload }: Request, res: Response, next: NextFunction): Promise<void> {
    if (!tokenPayload) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware');
    }

    const foundedUser = await this.userService.exists(tokenPayload.id);

    if (!foundedUser) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'PrivateRouteMiddleware');
    }

    return next();
  }
}
