import { ReturnModelType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from 'pino';

import { Component } from '../../types/component.enum.js';
import { ArticleEntity } from '../article/article.entity.js';
import { TagService } from './tag-service.interface.js';

@injectable()
export class DefaultTagService implements TagService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ArticleModel) private readonly articleModel: ReturnModelType<typeof ArticleEntity>,
  ) {}

  public async find(): Promise<string[]> {
    const result = await this.articleModel.aggregate<{ tags: string[] }>([
      {
        $group: {
          _id: null,
          tagList: {
            $push: '$tagList',
          },
        },
      },
      {
        $project: {
          _id: 0,
          tags: {
            $reduce: {
              input: '$tagList',
              initialValue: [],
              in: {
                $setUnion: ['$$value', '$$this'],
              },
            },
          },
        },
      },
    ]);

    return result[0].tags;
  }
}
