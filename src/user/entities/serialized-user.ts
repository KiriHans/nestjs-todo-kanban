import { Exclude } from 'class-transformer';
import { User } from './user.entity';

export class SerializedUser implements User {
  email: string;
  id: string;

  @Exclude()
  password: string;

  username: string;

  constructor(partial: Partial<SerializedUser>) {
    Object.assign(this, partial);
  }
}
