import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { LoginUserMessage } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: LoginUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: LoginUserMessage.password.invalidFormat })
  public password: string;
}
