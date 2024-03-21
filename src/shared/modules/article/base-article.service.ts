import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { ArticleService } from './article-service.interface.js';
import { ArticleEntity } from './article.entity.js';
import { CreateArticleDto } from './dto/create-article.dto.js';
import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { UpdateArticleDto } from './dto/update-article.dto.js';
import { FindRequestQuery } from './types/find-request-query.type.js';
import { DEFAULT_ARTICLES_COUNT, DEFAULT_ARTICLES_OFFSET } from './article.constant.js';

@injectable()
export class BaseArticleService implements ArticleService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.ArticleModel) private readonly articleModel: ReturnModelType<typeof ArticleEntity>,
  ) {}

  public async create(dto: CreateArticleDto): Promise<DocumentType<ArticleEntity>> {
    const result = await (await this.articleModel.create(dto)).populate('userId');

    this.logger.info(`A new article has been created: ${dto.title}`);

    return result;
  }

  public async findById(articleId: string): Promise<DocumentType<ArticleEntity> | null> {
    return this.articleModel.findById(articleId).populate('userId');
  }

  public async findByTitle(title: string): Promise<DocumentType<ArticleEntity> | null> {
    return this.articleModel.findOne({ title }).populate('userId');
  }

  public async find({
    author,
    favorited,
    limit = DEFAULT_ARTICLES_COUNT,
    offset = DEFAULT_ARTICLES_OFFSET,
    tag,
  }: FindRequestQuery = {}) {
    return this.articleModel.aggregate([
      { $match: tag ? { $expr: { $in: [tag, '$tagList'] } } : {} },
      {
        $lookup: {
          from: 'users',
          let: { userId: '$userId' },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$userId'] } } }, { $addFields: { id: '$_id' } }],
          as: 'userId',
        },
      },
      {
        $set: {
          userId: {
            $first: '$userId',
          },
        },
      },
      { $match: author ? { 'userId.username': author } : {} },
      { $sort: { createdAt: SortType.Desc } },
      { $skip: offset },
      { $limit: limit },
    ]);
  }

  public async getTotalCount(): Promise<number> {
    return this.articleModel.countDocuments();
  }

  public async updateById(articleId: string, dto: UpdateArticleDto): Promise<DocumentType<ArticleEntity>> {
    const result = await (await this.articleModel.findByIdAndUpdate(articleId, dto, { new: true })).populate('userId');

    this.logger.info(`The article has been updated: ${result.title}`);

    return result;
  }

  public async deleteById(articleId: string): Promise<DocumentType<ArticleEntity> | null> {
    const result = await this.articleModel.findByIdAndDelete(articleId);

    this.logger.info(`The article has been deleted: ${result.title}`);

    return result;
  }

  public async exists(documentId: string): Promise<Boolean> {
    const result = await this.articleModel.findById(documentId);
    
    return Boolean(result);
  }
}
