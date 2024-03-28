import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError, Middleware } from '../../../libs/rest/index.js';
import { UserService } from '../user-service.interface.js';

export class CheckCredentialsAvailableMiddleware implements Middleware {
  constructor(private readonly userService: UserService) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const userWithSameEmail = await this.userService.findByEmail(req.body.user.email);

    if (userWithSameEmail) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${req.body.user.email} has already been registered`,
        'CheckCredentialsAvailableMiddleware',
      );
    }

    const userWithSameUsername = await this.userService.findByUsername(req.body.user.username);

    if (userWithSameUsername) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with username ${req.body.user.username} has already been registered`,
        'CheckCredentialsAvailableMiddleware',
      );
    }

    next();
  }
}
