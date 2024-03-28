import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { Logger } from 'shared/libs/logger/logger.interface.js';

import { Component } from '../../types/component.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserEntity } from './user.entity.js';
import { UserService } from './user-service.interface.js';

@injectable()
export class DefaultUserService implements UserService {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {}

  public async find(): Promise<DocumentType<UserEntity>[]> {
    return this.userModel.find();
  }

  public async create(dto: CreateUserDto['user']): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity(dto);

    await user.setPassword(dto.password);

    const result = await this.userModel.create(user);

    this.logger.info(`A new user has been created: ${user.id}`);

    return result;
  }

  public async findById(id: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.findById(id);
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.findOne({ email });
  }

  public async findByUsername(username: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.findOne({ username });
  }

  public async updateById(userId: string, dto: UpdateUserDto['user']): Promise<DocumentType<UserEntity>> {
    const result = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });

    this.logger.info(`The user has been updated: ${result.id}`);

    return result;
  }

  public async exists(userId: string): Promise<boolean> {
    const result = await this.userModel.findById(userId);

    return !!result;
  }

  public async followUser(currentUserId: string, followingUserId: string): Promise<void> {
    const currentUser = await this.userModel.findById(currentUserId);

    await currentUser.followUser(followingUserId);
  }

  public async unfollowUser(currentUserId: string, unfollowingUserId: string): Promise<void> {
    const currentUser = await this.userModel.findById(currentUserId);

    await currentUser.unfollowUser(unfollowingUserId);
  }

  public async isFollowing(currentUserId: string, checkingUserId: string): Promise<boolean> {
    const currentUser = await this.userModel.findById(currentUserId);

    return currentUser.isFollowing(checkingUserId);
  }
}
