import { IsEmail, IsString, Length, MinLength } from 'class-validator';

import { CreateUserMessage } from './create-user.messages.js';

export class CreateUserDto {
  @IsString({ message: CreateUserMessage.username.invalidFormat })
  @Length(2, 15, { message: CreateUserMessage.username.length })
  public username: string;

  @IsEmail({}, { message: CreateUserMessage.email.invalidFormat })
  public email: string;

  @MinLength(6, { message: CreateUserMessage.password.minLength })
  @IsString({ message: CreateUserMessage.password.invalidFormat })
  public password: string;
}
