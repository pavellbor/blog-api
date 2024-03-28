import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Config } from 'shared/libs/config/config.interface.js';
import { RestSchema } from 'shared/libs/config/rest.schema.js';

import { fillDTO } from '../../../helpers/index.js';
import { Logger } from '../../../libs/logger/index.js';
import { BaseController, HttpMethod, ValidateDtoMiddleware } from '../../../libs/rest/index.js';
import { Component } from '../../../types/index.js';
import { AuthService } from '../../auth/index.js';
import { CreateUserDto } from '../dto/create-user.dto.js';
import { LoginUserDto } from '../dto/login-user.dto.js';
import { CheckCredentialsAvailableMiddleware } from '../middleware/check-credentials-available.middleware.js';
import { LoggedUserRdo } from '../rdo/logged-user.rdo.js';
import { UserRdo } from '../rdo/user.rdo.js';
import { LoginUserRequest } from '../types/login-user-request.type.js';
import { RegisterUserRequest } from '../types/register-user-request.type.js';
import { UserService } from '../user-service.interface.js';

@injectable()
export class UsersController extends BaseController {
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
      path: '/login',
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)],
    });
    this.addRoute({
      method: HttpMethod.Post,
      path: '/',
      handler: this.register,
      middlewares: [
        new ValidateDtoMiddleware(CreateUserDto),
        new CheckCredentialsAvailableMiddleware(this.userService),
      ],
    });
  }

  public async index(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const users = await this.userService.find();
    this.ok(res, fillDTO(UserRdo, users));
  }

  public async login({ body }: LoginUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await this.authService.verify(body.user);
    const token = this.authService.authenticate(user);

    const { username, email, image, bio } = user;
    const responseData = fillDTO(LoggedUserRdo, { user: { username, email, image, bio, token } });

    this.ok(res, responseData);
  }

  public async register(req: RegisterUserRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await this.userService.create(req.body.user);
    this.created(res, fillDTO(UserRdo, user));
  }
}
