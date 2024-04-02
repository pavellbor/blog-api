import { Type } from 'class-transformer';
import { IsArray, IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

import { CreateArticleValidationMessage } from './create-article.messages.js';

export class Article {
  @IsString({ message: CreateArticleValidationMessage.title.invalidFormat })
  @MinLength(10, { message: CreateArticleValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateArticleValidationMessage.title.maxLength })
  public title: string;

  @IsString({ message: CreateArticleValidationMessage.description.invalidFormat })
  @MinLength(20, { message: CreateArticleValidationMessage.description.minLength })
  @MaxLength(1024, { message: CreateArticleValidationMessage.description.maxLength })
  public description: string;

  @IsString({ message: CreateArticleValidationMessage.body.invalidFormat })
  @MinLength(20, { message: CreateArticleValidationMessage.body.minLength })
  @MaxLength(1024, { message: CreateArticleValidationMessage.body.maxLength })
  public body: string;

  @IsArray({ message: CreateArticleValidationMessage.tagList.invalidFormat })
  @IsString({ each: true, message: CreateArticleValidationMessage.tagList.childrenInvalidFormat })
  @IsOptional()
  public tagList?: string[];

  @IsOptional()
  public userId?: string;
}

export class CreateArticleDto {
  @Type(() => Article)
  @ValidateNested()
  @IsObject({ message: CreateArticleValidationMessage.article.invalidFormat })
  article: Article;
}
