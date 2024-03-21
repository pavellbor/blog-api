import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { UserService } from './user-service.interface.js';
import { UserEntity } from './user.entity.js';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/component.enum.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { Logger } from 'shared/libs/logger/logger.interface.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constant.js';

@injectable()
export class BaseUserService implements UserService {
  constructor(
    @inject(Component.Logger)
    private readonly logger: Logger,
    @inject(Component.UserModel)
    private readonly userModel: ReturnModelType<typeof UserEntity>,
  ) {}

  public async find(): Promise<DocumentType<UserEntity>[]> {
    return this.userModel.find();
  }

  public async create(dto: CreateUserDto): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({ ...dto, image: DEFAULT_AVATAR_FILE_NAME });

    await user.setPassword(dto.password);

    const result = await this.userModel.create(user);

    this.logger.info(`A new user has been created: ${user.username}`);

    return result;
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.findOne({ email });
  }

  public async findByUsername(username: string): Promise<DocumentType<UserEntity>> {
    return this.userModel.findOne({ username });
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity>> {
    const result = await this.userModel.findByIdAndUpdate(userId, dto, { new: true });

    this.logger.info(`The user has been updated: ${result.id}`);

    return result;
  }

  public async exists(userId: string): Promise<Boolean> {
    const result = await this.userModel.findById(userId);

    return !!result;
  }
}
