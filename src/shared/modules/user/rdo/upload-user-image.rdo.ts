import { Expose } from 'class-transformer';

export class UploadUserImageRdo {
  @Expose()
  public image: string;
}
