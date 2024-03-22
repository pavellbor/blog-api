import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

import { UpdateUserMessage } from './update-user.messages.js';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail({}, { message: UpdateUserMessage.email.invalidFormat })
  public email?: string;

  @IsOptional()
  @IsString({ message: UpdateUserMessage.bio.invalidFormat })
  @Length(2, 160, { message: UpdateUserMessage.bio.length })
  public bio?: string;

  @IsOptional()
  @IsString({ message: UpdateUserMessage.image.invalidFormat })
  public image?: string;
}
