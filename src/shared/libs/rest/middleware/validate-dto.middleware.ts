import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { reduceValidationErrors } from '../../../helpers/common.js';
import { ValidationError } from '../index.js';
import { Middleware } from './middleware.interface.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(private dto: ClassConstructor<object>) {}

  async execute({ body, path, baseUrl }: Request, res: Response, next: NextFunction): Promise<void> {
    const dtoInstance = plainToInstance(this.dto, body);

    const errors = await validate(dtoInstance, { whitelist: true, forbidNonWhitelisted: true });

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: ${baseUrl + path}`, reduceValidationErrors(errors));
    }

    next();
  }
}
