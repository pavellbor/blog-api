import { TokenPayload } from './src/shared/modules/auth/index.js';

declare module 'express' {
  export interface Request {
    tokenPayload: TokenPayload;
  }
}
