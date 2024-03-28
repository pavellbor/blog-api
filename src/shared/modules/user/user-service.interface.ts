import { DocumentType } from '@typegoose/typegoose';
import { DocumentExistsService } from 'shared/types/document-exists-service.interface.js';

import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './user.entity.js';

export interface UserService extends DocumentExistsService {
  find(): Promise<DocumentType<UserEntity>[]>;
  create(dto: CreateUserDto['user']): Promise<DocumentType<UserEntity>>;
  findById(id: string): Promise<DocumentType<UserEntity> | null>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByUsername(username: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto['user']): Promise<DocumentType<UserEntity>>;
  followUser(isFollowingByUserId: string, followUserId: string): Promise<void>;
  unfollowUser(isFollowingByUserId: string, followUserId: string): Promise<void>;
  isFollowingBy(isFollowingByUserId: string, followUserId: string): Promise<boolean>;
}
