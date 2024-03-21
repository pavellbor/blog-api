import { Request } from 'express';
import { UserIdParam } from './user-id-param.type.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';

export type UpdateUserRequest = Request<UserIdParam, unknown, UpdateUserDto>;
