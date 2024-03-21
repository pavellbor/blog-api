import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import { DocumentExistsService } from '../../../types/document-exists-service.interface.js';
import { HttpError } from '../index.js';
import { StatusCodes } from 'http-status-codes';

export class CheckDocumentExistsMiddleware implements Middleware {
  constructor(
    private readonly service: DocumentExistsService,
    private readonly paramName: string,
  ) {}

  async execute({ params }: Request, res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    const isDocumentExists = await this.service.exists(documentId);

    if (!isDocumentExists) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.paramName} ${documentId} has not been found`,
        CheckDocumentExistsMiddleware.name,
      );
    }

    next();
  }
}
