import { pino, Logger as PinoInstance } from 'pino';
import { Logger } from './logger.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Config } from '../config/config.interface.js';
import { RestConfig } from '../config/rest.config.js';
import { RestSchema } from '../config/rest.schema.js';

@injectable()
export class PinoLogger implements Logger {
  private logger: PinoInstance;

  constructor(@inject(Component.Config) private readonly config: Config<RestSchema>) {
    const transport = pino.transport({
      targets: [
        {
          target: 'pino/file',
          options: { destination: config.get('LOG_FILE_PATH') },
        },
        {
          target: 'pino-pretty',
        },
      ],
    });

    this.logger = pino(transport);
  }

  public info(message: string, ...args: unknown[]): void {
    this.logger.info(message, ...args);
  }

  public debug(message: string, ...args: unknown[]): void {
    this.logger.debug(message, ...args);
  }

  public error(message: string, error: Error, ...args: unknown[]): void {
    this.logger.error(error, message, ...args);
  }

  public warn(message: string, ...args: unknown[]): void {
    this.logger.warn(message, ...args);
  }
}
