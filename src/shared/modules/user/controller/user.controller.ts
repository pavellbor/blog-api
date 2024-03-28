import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Config } from 'shared/libs/config/config.interface.js';
import { RestSchema } from 'shared/libs/config/rest.schema.js';

import { fillDTO } from '../../../helpers/index.js';
import { Logger } from '../../../libs/logger/index.js';
import {
  BaseController,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
} from '../../../libs/rest/index.js';
import { Component } from '../../../types/index.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { LoggedUserRdo } from '../rdo/logged-user.rdo.js';
import { UploadUserImageRdo } from '../rdo/upload-user-image.rdo.js';
import { UserRdo } from '../rdo/user.rdo.js';
import { UpdateUserRequest } from '../types/update-user-request.type.js';
import { UserService } from '../user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    super(logger);

    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.checkAuthenticate,
      middlewares: [new PrivateRouteMiddleware(this.userService)],
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/',
      handler: this.update,
      middlewares: [new PrivateRouteMiddleware(this.userService), new ValidateDtoMiddleware(UpdateUserDto)],
    });
    this.addRoute({
      path: '/image',
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new PrivateRouteMiddleware(this.userService),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'image'),
      ],
    });
  }

  public async checkAuthenticate({ tokenPayload: { id } }: Request, res: Response): Promise<void> {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new HttpError(StatusCodes.UNAUTHORIZED, 'Unauthorized', 'UserController');
    }

    this.ok(res, fillDTO(LoggedUserRdo, { user }));
  }

  public async update(req: UpdateUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const updatedUser = await this.userService.updateById(req.tokenPayload.id, req.body.user);

    this.ok(res, fillDTO(UserRdo, updatedUser));
  }

  public async uploadAvatar({ tokenPayload, file }: Request, res: Response) {
    const userId = tokenPayload.id;
    const uploadFile = { image: file?.filename };

    await this.userService.updateById(userId, uploadFile);

    this.created(res, fillDTO(UploadUserImageRdo, uploadFile));
  }
}
