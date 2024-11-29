import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

export const USER_LIST: Readonly<User[]> = getUsersMock(4);

export function generateUser({
  email,
  password,
  username,
}: CreateUserDto): User {
  return {
    id: globalThis.crypto.randomUUID(),
    email,
    password,
    username,
    tasks: [],
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

export type MockUserType = {
  getUsers: jest.Mock<any, User[], any>;
  createUser: jest.Mock<any, any, any>;
  updateUser: jest.Mock<any, any, any>;
  getUserByUsername: jest.Mock<any, any, User>;
  getUserById: jest.Mock<any, any, any>;
};

export const getMockUserService = (): Readonly<MockUserType> =>
  ({
    getUsers: jest.fn<any, User[]>().mockResolvedValue([...USER_LIST] as const),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    getUserByUsername: jest.fn(),
    getUserById: jest.fn(),
  }) as const;
