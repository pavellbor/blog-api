import { Type } from 'class-transformer';
import { IsEmail, IsObject, IsOptional, IsString, Length, MinLength, ValidateNested } from 'class-validator';

import { UpdateUserMessage } from './update-user.messages.js';

class User {
  @IsOptional()
  @IsString({ message: UpdateUserMessage.username.invalidFormat })
  @Length(2, 15, { message: UpdateUserMessage.username.length })
  public username?: string;

  @IsOptional()
  @IsEmail({}, { message: UpdateUserMessage.email.invalidFormat })
  public email?: string;

  @IsOptional()
  @MinLength(6, { message: UpdateUserMessage.password.minLength })
  @IsString({ message: UpdateUserMessage.password.invalidFormat })
  public password?: string;

  @IsOptional()
  @IsString({ message: UpdateUserMessage.bio.invalidFormat })
  @Length(2, 160, { message: UpdateUserMessage.bio.length })
  public bio?: string;

  @IsOptional()
  @IsString({ message: UpdateUserMessage.image.invalidFormat })
  public image?: string;
}

export class UpdateUserDto {
  @Type(() => User)
  @ValidateNested()
  @IsObject({ message: UpdateUserMessage.user.invalidFormat })
  user: User;
}
