import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import {
  generateUser,
  getMockUserService,
  MockUserType,
  USER_LIST,
} from './util-user-test';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockUserService: MockUserType;

  beforeEach(async () => {
    mockUserService = getMockUserService();

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
