import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { fillDTO } from '../../helpers/common.js';
import { Logger } from '../../libs/logger/logger.interface.js';
import { BaseController, HttpMethod } from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { TagListRdo } from './rdo/tag-list.rdo.js';
import { TagService } from './tag-service.interface.js';

@injectable()
export class TagController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.TagService) private readonly tagService: TagService,
  ) {
    super(logger);

    this.addRoute({
      method: HttpMethod.Get,
      path: '/',
      handler: this.index,
    });
  }

  public async index(req: Request, res: Response, _next: NextFunction) {
    const tags = await this.tagService.find();

    this.ok(res, fillDTO(TagListRdo, { tags }));
  }
}
