import { Request } from 'express';

import { ListQueryParams } from '../../../libs/rest/index.js';

export type GetFeedArticlesRequest = Request<unknown, unknown, unknown, ListQueryParams>;
