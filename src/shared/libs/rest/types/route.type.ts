import { NextFunction, Request, Response } from 'express';
import { HttpMethod } from './http-method.enum.js';
import { Middleware } from '../middleware/middleware.interface.js';

export type Route = {
  method: HttpMethod;
  path: string;
  handler: (req: Request, res: Response, next: NextFunction) => void;
  middlewares?: Middleware[];
};
