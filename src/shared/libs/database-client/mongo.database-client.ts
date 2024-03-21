import mongoose from 'mongoose';
import { DatabaseClient } from './database-client.interface.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../logger/index.js';

@injectable()
export class MongoDatabaseClient implements DatabaseClient {
  private mongoose: typeof mongoose;

  constructor(@inject(Component.Logger) private readonly logger: Logger) {}

  public async connect(uri: string): Promise<void> {
    try {
      this.logger.info('Connecting to the database');
      this.mongoose = await mongoose.connect(uri);
      this.logger.info('The connection to the database is established');
    } catch (error) {
      this.logger.error('Failed to connect to the database', error);
    }
  }

  public async disconnect(): Promise<void> {
    this.mongoose.disconnect();
  }
}
