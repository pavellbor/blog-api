import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsString, Length, MinLength, ValidateNested } from 'class-validator';

import { CreateUserMessage } from './create-user.messages.js';

class User {
  @IsString({ message: CreateUserMessage.username.invalidFormat })
  @Length(2, 15, { message: CreateUserMessage.username.length })
  public username: string;

  @IsEmail({}, { message: CreateUserMessage.email.invalidFormat })
  public email: string;

  @MinLength(6, { message: CreateUserMessage.password.minLength })
  @IsString({ message: CreateUserMessage.password.invalidFormat })
  public password: string;
}

export class CreateUserDto {
  @Type(() => User)
  @ValidateNested({ message: CreateUserMessage.user.invalidFormat })
  @IsObject({})
  user: User;
}
