import { Request } from 'express';
import { LoginUserDto } from '../dto/login-user.dto.js';

export type LoginUserRequest = Request<unknown, unknown, LoginUserDto>;
