import { readFile } from 'fs/promises';

import { DatabaseClient } from '../../shared/libs/database-client/database-client.interface.js';
import { MongoDatabaseClient } from '../../shared/libs/database-client/mongo.database-client.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger } from '../../shared/libs/logger/logger.interface.js';
import { ArticleModel } from '../../shared/modules/article/article.entity.js';
import { ArticleService } from '../../shared/modules/article/article-service.interface.js';
import { BaseArticleService } from '../../shared/modules/article/base-article.service.js';
import { BaseCommentService } from '../../shared/modules/comment/base-comment.service.js';
import { CommentModel } from '../../shared/modules/comment/comment.entity.js';
import { CommentService } from '../../shared/modules/comment/comment-service.interface.js';
import { BaseUserService } from '../../shared/modules/user/base-user.service.js';
import { UserModel } from '../../shared/modules/user/user.entity.js';
import { UserService } from '../../shared/modules/user/user-service.interface.js';
import { MockData } from '../../shared/types/index.js';
import { CliCommand } from './cli-command.interface.js';

export class ImportCommand implements CliCommand {
  private logger: Logger;

  private databaseClient: DatabaseClient;

  private articleService: ArticleService;

  private userService: UserService;

  private commentService: CommentService;

  get name() {
    return '--import';
  }

  constructor() {
    this.logger = new ConsoleLogger();
    this.databaseClient = new MongoDatabaseClient(this.logger);

    this.articleService = new BaseArticleService(this.logger, ArticleModel);
    this.userService = new BaseUserService(this.logger, UserModel);
    this.commentService = new BaseCommentService(this.logger, CommentModel);
  }

  private async getParsedData(filePath: string): Promise<MockData> {
    const rawData = await readFile(filePath, { encoding: 'utf-8' });

    return JSON.parse(rawData) as MockData;
  }

  private async importDataToDb(databaseUri: string, importedData: MockData): Promise<void> {
    await this.databaseClient.connect(databaseUri);

    for (const userData of importedData.users) {
      await this.userService.create(userData);
    }

    for (const articleData of importedData.articles) {
      const existingUser = await this.userService.findByUsername(articleData.user);

      if (!existingUser) {
        throw new Error(`The user with username "${articleData.user}" was not found`);
      }

      await this.articleService.create({ ...articleData, userId: existingUser.id });
    }

    for (const commentData of importedData.comments) {
      const existingArticle = await this.articleService.findByTitle(commentData.article);

      if (!existingArticle) {
        throw new Error(`The article with title "${commentData.article}" was not found`);
      }

      const existingUser = await this.userService.findByUsername(commentData.user);

      if (!existingUser) {
        throw new Error(`The user with username "${commentData.user}" was not found`);
      }

      await this.commentService.create({
        body: commentData.body,
        articleId: existingArticle.id,
        userId: existingUser.id,
      });
    }

    this.logger.info(`All data has been successfully imported`);
  }

  public async execute(filePath: string, databaseUri: string) {
    if (!filePath) {
      throw new Error('The path to the file is a required parameter');
    }

    if (!databaseUri) {
      throw new Error('The database connection string is a required parameter');
    }

    const parsedData = await this.getParsedData(filePath);
    this.importDataToDb(databaseUri, parsedData);
  }
}
