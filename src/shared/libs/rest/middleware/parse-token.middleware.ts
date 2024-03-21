import { Request, Response, NextFunction } from 'express';
import { Middleware } from './middleware.interface.js';
import jwt from 'jsonwebtoken';
import { HttpError } from '../index.js';
import { StatusCodes } from 'http-status-codes';
import { TokenPayload } from 'shared/modules/auth/index.js';

function isTokenPayload(payload: unknown): payload is TokenPayload {
  return (
    typeof payload === 'object' &&
    payload !== null &&
    'email' in payload &&
    typeof payload.email === 'string' &&
    'username' in payload &&
    typeof payload.username === 'string' &&
    'id' in payload &&
    typeof payload.id === 'string'
  );
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

    next(new HttpError(StatusCodes.UNAUTHORIZED, 'Invalid token', 'AuthenticateMiddleware'));
  }
}
