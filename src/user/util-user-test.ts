import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export const USER_LIST: Readonly<User[]> = getUsersMock(4);

export function generateUser({ email, password, username }: CreateUserDto) {
  return {
    id: globalThis.crypto.randomUUID(),
    email,
    password,
    username,
  };
}

export function getUsersMock(numberUsers: number): User[] {
  return Array.from({ length: numberUsers }, (_, i) =>
    generateUser({
      email: `email_${i}@email.com`,
      password: `password_${i}`,
      username: `username_${i}`,
    }),
  );
}
