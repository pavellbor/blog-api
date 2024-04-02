import { Expose, Type } from 'class-transformer';

import { ArticleRdo } from './article.rdo.js';

export class SingleArticleRdo {
  @Expose()
  @Type(() => ArticleRdo)
  article: ArticleRdo;
}
