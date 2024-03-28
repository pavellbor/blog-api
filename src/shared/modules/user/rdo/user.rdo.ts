import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  username: string;

  @Expose()
  email: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;
}
