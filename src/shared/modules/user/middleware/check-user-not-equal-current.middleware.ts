import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { HttpError, Middleware } from '../../../libs/rest/index.js';
import { UserService } from '../user-service.interface.js';

export class CheckUserNotEqualCurrentMiddleware implements Middleware {
  constructor(
    private readonly userService: UserService,
    private readonly errorMessage: string,
  ) {}

  public async execute(
    { params: { username }, tokenPayload }: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    const followUser = await this.userService.findByUsername(username);

    if (followUser.id === tokenPayload.id) {
      throw new HttpError(StatusCodes.BAD_REQUEST, this.errorMessage, 'ChecUserNotEqualCurrentMiddleware');
    }

    next();
  }
}
