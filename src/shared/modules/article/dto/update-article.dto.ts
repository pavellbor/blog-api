import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

import { UpdateArticleValidationMessage } from './update-article.message.js';

export class Article {
  @IsOptional()
  @IsString({ message: UpdateArticleValidationMessage.title.invalidFormat })
  @MinLength(10, { message: UpdateArticleValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateArticleValidationMessage.title.maxLength })
  public title?: string;

  @IsOptional()
  @IsString({ message: UpdateArticleValidationMessage.description.invalidFormat })
  @MinLength(20, { message: UpdateArticleValidationMessage.description.minLength })
  @MaxLength(1024, { message: UpdateArticleValidationMessage.description.maxLength })
  public description?: string;

  @IsOptional()
  @IsString({ message: UpdateArticleValidationMessage.body.invalidFormat })
  @MinLength(20, { message: UpdateArticleValidationMessage.body.minLength })
  @MaxLength(1024, { message: UpdateArticleValidationMessage.body.maxLength })
  public body?: string;
}

export class UpdateArticleDto {
  @Type(() => Article)
  @ValidateNested()
  @IsObject({ message: UpdateArticleValidationMessage.article.invalidFormat })
  article: Article;
}
