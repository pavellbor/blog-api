import { Expose, Type } from 'class-transformer';

import { ArticleRdo } from './article.rdo.js';

export class MultipleArticlesRdo {
  @Expose()
  @Type(() => ArticleRdo)
  data: ArticleRdo[];

  @Expose()
  count: number;
}
