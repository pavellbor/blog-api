import * as dotenv from 'dotenv';
import { inject, injectable } from 'inversify';

import { Component } from '../../types/index.js';
import { Logger } from '../logger/index.js';
import { Config } from './config.interface.js';

@injectable()
export class BaseConfig<T> implements Config<T> {
  private readonly config: T;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    const { error, parsed } = dotenv.config();

    if (error) {
      this.logger.error('.env file not found', error);
      throw error;
    }

    this.config = parsed as T;
  }

  public get<U extends keyof T>(key: U): T[U] {
    return this.config[key];
  }
}
