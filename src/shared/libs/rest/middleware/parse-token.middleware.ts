import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
// eslint-disable-next-line import/default
import jwt from 'jsonwebtoken';
import { TokenPayload } from 'shared/modules/auth/index.js';

import { HttpError } from '../index.js';
import { Middleware } from './middleware.interface.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return typeof payload === 'object' && payload !== null && 'id' in payload && typeof payload.id === 'string';
}

export class ParseTokenMiddleware implements Middleware {
  constructor(private readonly jwtSecret: string) {}

  public execute(req: Request, res: Response, next: NextFunction): void {
    const authorizationHeader = req.headers?.authorization?.split(' ');

    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const payload = jwt.verify(token, this.jwtSecret);

      if (isTokenPayload(payload)) {
        req.tokenPayload = { ...payload };
        return next();
      }
    } catch {}

    next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'ParseTokenMiddleware'));
  }
}
