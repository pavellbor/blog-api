import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Config } from 'shared/libs/config/config.interface.js';
import { RestSchema } from 'shared/libs/config/rest.schema.js';

import { fillDTO } from '../../../helpers/index.js';
import { Logger } from '../../../libs/logger/index.js';
import { BaseController, HttpMethod, PrivateRouteMiddleware } from '../../../libs/rest/index.js';
import { Component } from '../../../types/index.js';
import { CheckUserExistsMiddleware, CheckUserNotEqualCurrentMiddleware } from '../middleware/index.js';
import { UserProfileRdo } from '../rdo/user-profile.rdo.js';
import { UserService } from '../user-service.interface.js';

@injectable()
export class ProfilesController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
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
    const followUser = await this.userService.findByUsername(username);
    let isFollowing = false;

    if (tokenPayload) {
      isFollowing = await this.userService.isFollowingBy(tokenPayload.id, followUser.id);
    }

    const profile = {
      username: followUser.username,
      bio: followUser.bio,
      image: followUser.image,
      following: isFollowing,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }

  public async followUser({ params: { username }, tokenPayload }: Request, res: Response) {
    const followUser = await this.userService.findByUsername(username);

    await this.userService.followUser(tokenPayload.id, followUser.id);

    const profile = {
      username: followUser.username,
      bio: followUser.bio,
      image: followUser.image,
      following: true,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }

  public async unfollowUser({ params: { username }, tokenPayload }: Request, res: Response) {
    const followUser = await this.userService.findByUsername(username);

    await this.userService.unfollowUser(tokenPayload.id, followUser.id);

    const profile = {
      username: followUser.username,
      bio: followUser.bio,
      image: followUser.image,
      following: false,
    };

    this.ok(res, fillDTO(UserProfileRdo, { profile }));
  }
}
