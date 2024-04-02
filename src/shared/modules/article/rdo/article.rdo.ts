import { Expose, Type } from 'class-transformer';

import { Profile } from '../../user/rdo/user-profile.rdo.js';

export class ArticleRdo {
  @Expose()
  slug: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  body: string;

  @Expose()
  tagList: string[];

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  favorited: boolean;

  @Expose()
  favoritesCount: number;

  @Expose({
    name: 'userId',
  })
  @Type(() => Profile)
  author: Profile;
}
