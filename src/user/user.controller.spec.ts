import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { generateUser, USER_LIST } from './util-user-test';
import { UpdateUserDto } from './dto/update-user.dto';

type mockUserType = {
  getUsers: jest.Mock<any, User[], any>;
  createUser: jest.Mock<any, any, any>;
  updateUser: jest.Mock<any, any, any>;
  getUserByUsername: jest.Mock<any, any, any>;
  getUserById: jest.Mock<any, any, any>;
};

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: mockUserType;

  beforeEach(async () => {
    mockUserService = {
      getUsers: jest
        .fn<any, User[]>()
        .mockResolvedValue([...USER_LIST] as const),
      createUser: jest.fn(),
      updateUser: jest.fn(),
      getUserByUsername: jest.fn(),
      getUserById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      const result = await controller.getUsers();

      expect(result).toEqual(USER_LIST);

      expect(mockUserService.getUsers).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user given id and body', async () => {
      const oldUser: User = generateUser({
        email: 'old_email@email.com',
        password: 'oldPassword123',
        username: 'oldUsername321',
      });

      const [idUser, body]: [string, UpdateUserDto] = [
        oldUser.id,
        {
          email: 'new_email@email.com',
        },
      ];

      const updatedUser = generateUser({
        ...oldUser,
        ...body,
      });

      mockUserService.updateUser.mockResolvedValue(updatedUser);

      const result = await controller.update(idUser, body);

      expect(result).toEqual(updatedUser);

      expect(mockUserService.updateUser).toHaveBeenCalledWith(idUser, body);
    });
  });
});
