import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../../helpers/index.js';
import { Logger } from '../../../libs/logger/index.js';
import { BaseController, HttpError, HttpMethod, PrivateRouteMiddleware } from '../../../libs/rest/index.js';
import { Component } from '../../../types/index.js';
import { CheckUserExistsMiddleware, CheckUserNotEqualCurrentMiddleware } from '../middleware/index.js';
import { UserProfileRdo } from '../rdo/user-profile.rdo.js';
import { UserService } from '../user-service.interface.js';

@injectable()
export class ProfilesController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {
    super(logger);

    this.addRoute({
      method: HttpMethod.Get,
      path: '/:username',
      handler: this.getProfile,
      middlewares: [new CheckUserExistsMiddleware(this.userService)],
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/:username/follow',
      handler: this.followUser,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckUserExistsMiddleware(this.userService),
        new CheckUserNotEqualCurrentMiddleware(this.userService, "You can't follow yourself"),
      ],
    });
    this.addRoute({
      method: HttpMethod.Delete,
      path: '/:username/follow',
      handler: this.unfollowUser,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new CheckUserExistsMiddleware(this.userService),
        new CheckUserNotEqualCurrentMiddleware(this.userService, "You can't unfollow yourself"),
      ],
    });
  }

  public async getProfile({ params: { username }, tokenPayload }: Request, res: Response): Promise<void> {
    const followingUser = await this.userService.findByUsername(username);
    let isFollowing = false;

    if (tokenPayload) {
      isFollowing = await this.userService.isFollowing(tokenPayload.id, followingUser.id);
    }

    const profile = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: isFollowing,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }

  public async followUser({ params: { username }, tokenPayload }: Request, res: Response) {
    const followingUser = await this.userService.findByUsername(username);
    const isFollowing = await this.userService.isFollowing(tokenPayload.id, followingUser.id);

    if (isFollowing) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The user is already following the user with username ${username}`,
        'ProfilesController',
      );
    }

    await this.userService.followUser(tokenPayload.id, followingUser.id);

    const profile = {
      username: followingUser.username,
      bio: followingUser.bio,
      image: followingUser.image,
      following: true,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }

  public async unfollowUser({ params: { username }, tokenPayload }: Request, res: Response) {
    const unfollowingUser = await this.userService.findByUsername(username);
    const isFollowing = await this.userService.isFollowing(tokenPayload.id, unfollowingUser.id);

    if (!isFollowing) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The user does not follow the user with username ${username}`,
        'ProfilesController',
      );
    }

    await this.userService.unfollowUser(tokenPayload.id, unfollowingUser.id);

    const profile = {
      username: unfollowingUser.username,
      bio: unfollowingUser.bio,
      image: unfollowingUser.image,
      following: false,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }
}
