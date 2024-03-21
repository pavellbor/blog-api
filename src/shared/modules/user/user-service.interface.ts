import { DocumentType } from '@typegoose/typegoose';
import { UserEntity } from './user.entity.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DocumentExistsService } from 'shared/types/document-exists-service.interface.js';
import { LoginUserDto } from './dto/login-user.dto.js';

export interface UserService extends DocumentExistsService {
  find(): Promise<DocumentType<UserEntity>[]>;
  create(dto: CreateUserDto): Promise<DocumentType<UserEntity>>;
  findByEmail(email: string): Promise<DocumentType<UserEntity> | null>;
  findByUsername(username: string): Promise<DocumentType<UserEntity> | null>;
  updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity>>;
}