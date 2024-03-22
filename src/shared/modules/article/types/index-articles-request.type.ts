import { Request } from 'express';
import { RequestParams } from 'shared/libs/rest/index.js';

import { FindRequestQuery } from './find-request-query.type.js';

export type IndexArticlesRequest = Request<RequestParams, unknown, unknown, FindRequestQuery>;
