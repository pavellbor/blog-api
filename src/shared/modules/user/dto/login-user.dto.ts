import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsString, ValidateNested } from 'class-validator';

import { LoginUserMessage } from './login-user.messages.js';

class User {
  @IsEmail({}, { message: LoginUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: LoginUserMessage.password.invalidFormat })
  public password: string;
}

export class LoginUserDto {
  @Type(() => User)
  @ValidateNested()
  @IsObject({ message: LoginUserMessage.user.invalidFormat })
  user: User;
}
