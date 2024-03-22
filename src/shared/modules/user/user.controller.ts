import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Config } from 'shared/libs/config/config.interface.js';
import { RestSchema } from 'shared/libs/config/rest.schema.js';

import { fillDTO } from '../../helpers/index.js';
import { Logger } from '../../libs/logger/index.js';
import {
  BaseController,
  CheckDocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  UploadFileMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { AuthService } from '../auth/index.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { LoginUserDto } from './dto/login-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { LoggedUserRdo } from './rdo/logged-user.rdo.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './types/login-user-request.type.js';
import { RegisterUserRequest } from './types/register-user-request.type.js';
import { UpdateUserRequest } from './types/update-user-request.type.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.AuthService) private readonly authService: AuthService,
  ) {
    super(logger);

    this.addRoute({ method: HttpMethod.Get, path: '/', handler: this.index });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/register',
      handler: this.register,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)],
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/login',
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      method: HttpMethod.Patch,
      path: '/:userId',
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('userId'),
        new CheckDocumentExistsMiddleware(this.userService, 'userId'),
        new ValidateDtoMiddleware(UpdateUserDto),
        new UploadFileMiddleware(this.config.get('UPLOAD_DIRECTORY'), 'image'),
      ],
    });
  }

  public async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const users = await this.userService.find();
    this.ok(res, fillDTO(UserRdo, users));
  }

  public async register(req: RegisterUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const userWithSameEmail = await this.userService.findByEmail(req.body.email);

    if (userWithSameEmail) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email ${req.body.email} has already been registered`,
        'userController',
      );
    }

    const userWithSameUsername = await this.userService.findByUsername(req.body.username);

    if (userWithSameUsername) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with username ${req.body.username} has already been registered`,
        'userController',
      );
    }

    const user = await this.userService.create(req.body);
    this.created(res, fillDTO(UserRdo, user));
  }

  public async login({ body }: LoginUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await this.authService.verify(body);
    const token = this.authService.authenticate(user);

    const responseData = fillDTO(LoggedUserRdo, { username: user.username, email: user.email, token });

    this.ok(res, responseData);
  }

  public async update(req: UpdateUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const updatedUser = await this.userService.updateById(req.params.userId, { ...req.body, image: req.file.filename });

    this.ok(res, fillDTO(UserRdo, updatedUser));
  }
}
