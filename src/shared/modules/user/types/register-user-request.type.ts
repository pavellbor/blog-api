import { Request } from 'express';
import { CreateUserDto } from '../dto/create-user.dto.js';

export type RegisterUserRequest = Request<unknown, unknown, CreateUserDto>;
