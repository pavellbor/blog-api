import { inject, injectable } from 'inversify';
import { getFullServerPath, isObject } from '../../../../shared/helpers/common.js';
import { Config } from '../../../../shared/libs/config/config.interface.js';
import { RestSchema } from '../../../../shared/libs/config/rest.schema.js';
import { Logger } from '../../../../shared/libs/logger/logger.interface.js';
import { Component } from '../../../../shared/types/component.enum.js';
import { STATIC_RESOURCE_FIELDS } from './path-transformer.constant.js';
import { STATIC_FILES_ROUTE, STATIC_UPLOAD_ROUTE } from '../../../../rest/rest.constant.js';
import { readdir } from 'fs/promises';

@injectable()
export class PathTransformer {
  private staticDirectoryFiles: string[] = [];

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
  ) {
    this.logger.info('PathTransformer created!');
  }

  private isStaticProperty(property: string) {
    return STATIC_RESOURCE_FIELDS.includes(property);
  }

  private isFileInStaticDirectory(fileName: string) {
    return this.staticDirectoryFiles.includes(fileName);
  }

  private async getFilesFromStaticDirectory() {
    this.staticDirectoryFiles = await readdir(this.config.get('STATIC_DIRECTORY_PATH'));
  }

  public async execute(data: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.getFilesFromStaticDirectory();

    const stack = [data];

    while (stack.length > 0) {
      const current = stack.pop();

      for (const key in current) {
        if (Object.hasOwn(current, key)) {
          const value = current[key];

          if (isObject(value)) {
            stack.push(value);
            continue;
          }

          if (this.isStaticProperty(key) && typeof value === 'string') {
            const serverHost = this.config.get('HOST');
            const serverPort = this.config.get('PORT');
            const rootPath = this.isFileInStaticDirectory(value) ? STATIC_FILES_ROUTE : STATIC_UPLOAD_ROUTE;

            current[key] = `${getFullServerPath(serverHost, serverPort)}${rootPath}/${encodeURI(value)}`;
          }
        }
      }
    }

    return data;
  }
}
