import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError, Middleware } from '../../../libs/rest/index.js';
import { UserService } from '../user-service.interface.js';

export class CheckUserExistsMiddleware implements Middleware {
  constructor(private readonly userService: UserService) {}

  public async execute({ params: { username } }: Request, res: Response, next: NextFunction): Promise<void> {
    const foundedUser = await this.userService.findByUsername(username);

    if (!foundedUser) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `User with username ${username} has not been found`,
        'CheckUserExistsMiddleware',
      );
    }

    next();
  }
}
