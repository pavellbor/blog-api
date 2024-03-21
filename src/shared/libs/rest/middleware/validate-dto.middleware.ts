import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { validate } from 'class-validator';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { reduceValidationErrors } from '../../../helpers/common.js';
import { ValidationError } from '../index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  async execute({ body, path, baseUrl }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);

    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${baseUrl + path}`, reduceValidationErrors(errors));
    }

    next();
  }
}
