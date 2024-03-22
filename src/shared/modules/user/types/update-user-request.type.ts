import { Request } from 'express';

import { UpdateUserDto } from '../dto/update-user.dto.js';
import { UserIdParam } from './user-id-param.type.js';

export type UpdateUserRequest = Request<UserIdParam, unknown, UpdateUserDto>;
