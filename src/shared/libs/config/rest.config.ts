import { injectable } from 'inversify';
import { Config } from './config.interface.js';
import { RestSchema, restConfigSchema } from './rest.schema.js';
import dotenv from 'dotenv';

@injectable()
export class RestConfig implements Config<RestSchema> {
  private readonly config: RestSchema;

  constructor() {
    const { error } = dotenv.config();

    if (error) {
      throw new Error("Can't read .env file. Perhaps the file does not exists");
    }

    restConfigSchema.load({});
    restConfigSchema.validate({ allowed: 'strict' });

    this.config = restConfigSchema.getProperties();
  }

  get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
