import { Expose } from 'class-transformer';

export class TagListRdo {
  @Expose()
  tags: string[];
}
