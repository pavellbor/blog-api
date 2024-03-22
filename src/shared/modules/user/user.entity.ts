import { defaultClasses, getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import * as bcrypt from 'bcrypt';

import { User } from '../../types/index.js';
import { SALT_ROUNDS } from './user.constant.js';

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users',
  },
})
export class UserEntity extends defaultClasses.TimeStamps implements User {
  @prop({
    unique: true,
  })
  public username: string;

  @prop({
    required: true,
    unique: true,
  })
  public email: string;

  @prop()
  public image: string;

  @prop()
  public bio?: string;

  @prop({
    required: true,
  })
  private password?: string;

  constructor(userData: User) {
    super();

    this.username = userData.username;
    this.email = userData.email;
    this.image = userData.image;
  }

  public async setPassword(password: string) {
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    this.password = await bcrypt.hash(password, salt);
  }

  public async comparePassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}

export const UserModel = getModelForClass(UserEntity);
