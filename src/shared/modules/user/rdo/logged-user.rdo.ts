import { Expose, Type } from 'class-transformer';

class User {
  @Expose()
  public token: string;

  @Expose()
  public email: string;

  @Expose()
  public username: string;

  @Expose()
  public image: string;

  @Expose()
  public bio: string;
}

export class LoggedUserRdo {
  @Expose()
  @Type(() => User)
  public user: User;
}
