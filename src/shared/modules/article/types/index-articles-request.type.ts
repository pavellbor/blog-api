import { Request } from 'express';
import { FindRequestQuery } from './find-request-query.type.js';
import { RequestParams } from 'shared/libs/rest/index.js';

export type IndexArticlesRequest = Request<RequestParams, unknown, unknown, FindRequestQuery>;
