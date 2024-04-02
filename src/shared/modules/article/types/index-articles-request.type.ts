import { Request } from 'express';

import { ListQueryParams } from '../../../libs/rest/index.js';

export type RequestQuery = {
  tag?: string;
  author?: string;
  favorited?: string;
} & ListQueryParams;

export type IndexArticlesRequest = Request<unknown, unknown, unknown, RequestQuery>;
