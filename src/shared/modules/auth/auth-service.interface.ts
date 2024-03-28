import { LoginUserDto } from '../user/dto/login-user.dto.js';
import { UserEntity } from '../user/user.entity.js';

export interface AuthService {
  authenticate(user: UserEntity): string;
  verify(dto: LoginUserDto['user']): Promise<UserEntity>;
}
