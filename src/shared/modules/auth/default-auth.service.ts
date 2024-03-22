import { inject, injectable } from 'inversify';
import * as jwt from 'jsonwebtoken';
import { Config } from 'shared/libs/config/config.interface.js';
import { RestSchema } from 'shared/libs/config/rest.schema.js';

import { Logger } from '../../libs/logger/logger.interface.js';
import { Component } from '../../types/component.enum.js';
import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';
import { UserService } from '../user/user-service.interface.js';
import { JWT_ALGORITHM, JWT_EXPIRED } from './auth.constant.js';
import { AuthService } from './auth-service.interface.js';
import { UserNotFoundException, UserPasswordIncorrectException } from './errors/index.js';
import { TokenPayload } from './types/token-payload.type.js';

@injectable()
export class DefaultAuthService implements AuthService {
  constructor(
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config) private readonly configService: Config<RestSchema>,
    @inject(Component.Logger) private readonly logger: Logger,
  ) {}

  public authenticate(user: UserEntity): string {
    const payload: TokenPayload = { id: user.id, email: user.email, username: user.username };
    const token = jwt.sign(payload, this.configService.get('JWT_SECRET'), {
      algorithm: JWT_ALGORITHM,
      expiresIn: JWT_EXPIRED,
    });

    return token;
  }

  public async verify(dto: LoginUserDto): Promise<UserEntity> {
    const user = await this.userService.findByEmail(dto.email);

    if (!user) {
      this.logger.warn(`User with ${dto.email} not found`);
      throw new UserNotFoundException();
    }

    if (!(await user.comparePassword(dto.password))) {
      this.logger.warn(`Incorrect password for ${dto.email}`);
      throw new UserPasswordIncorrectException();
    }

    return user;
  }
}
