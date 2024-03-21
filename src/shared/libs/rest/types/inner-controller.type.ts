import { Router } from 'express';
import { Middleware } from '../index.js';

export type InnerController = {
  path: string;
  router: Router;
  middlewares: Middleware[];
};
