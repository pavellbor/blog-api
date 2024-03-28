import { Expose, Type } from 'class-transformer';

export class Profile {
  @Expose()
  username: string;

  @Expose()
  bio: string;

  @Expose()
  image: string;

  @Expose()
  following: false;
}

export class UserProfileRdo {
  @Expose()
  @Type(() => Profile)
  public profile: Profile;
}
