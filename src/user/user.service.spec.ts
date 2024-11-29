import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundException } from '@nestjs/common';
import { generateUser, getUsersMock } from './util-user-test';

type MockRep = {
  create: jest.Mock<any, any, any>;
  save: jest.Mock<any, any, any>;
  delete: jest.Mock<any, any, any>;
  findOne: jest.Mock<any, any, any>;
  find: jest.Mock<any, any, any>;
};

describe('UserService', () => {
  let service: UserService;
  let mockTestRepository: MockRep;

  beforeEach(async () => {
    mockTestRepository = {
      create: jest.fn(),
      save: jest.fn(),
      delete: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockTestRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    it('should create new user and return its data', async () => {
      const createUserDto: CreateUserDto = {
        email: 'Test@email.com',
        password: 'test1234',
        username: 'marina',
      };

      const createUserClass = new User();
      Object.assign(createUserClass, createUserDto);

      mockTestRepository.create.mockReturnValue(createUserClass);

      const result = await service.createUser(createUserDto);

      expect(mockTestRepository.create).toHaveBeenCalled();
      expect(mockTestRepository.create).toHaveBeenCalledWith(createUserDto);

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(createUserClass);

      expect(result).toEqual(createUserClass);
    });
  });

  describe('updateUser', () => {
    let oldUser: User;
    let idUser: string;
    beforeEach(() => {
      oldUser = {
        id: globalThis.crypto.randomUUID(),
        email: 'old_email@emai.com',
        password: 'old_password',
        username: 'old_username',
        tasks: [],
      };

      idUser = oldUser.id;
    });

    it('should update the username and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'new_username',
      };

      const newUser: User = {
        ...oldUser,
        ...updateUserDto,
      };

      mockTestRepository.findOne.mockResolvedValue(oldUser);
      mockTestRepository.save.mockResolvedValue(newUser);

      const result = await service.updateUser(idUser, updateUserDto);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idUser },
      });

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(newUser);

      expect(result).toEqual(newUser);
    });

    // TODO: In future implementations, email should revalidate
    it('should update the email and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'newEmail@email.com',
      };

      const newUser: User = {
        ...oldUser,
        ...updateUserDto,
      };

      mockTestRepository.findOne.mockResolvedValue(oldUser);
      mockTestRepository.save.mockResolvedValue(newUser);

      const result = await service.updateUser(idUser, updateUserDto);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idUser },
      });

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(newUser);

      expect(result).toEqual(newUser);
    });

    // TODO: In future implementations, before changing password
    // it should send an email to comfirm user's identity
    it('should update the password and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      const newUser: User = {
        ...oldUser,
        ...updateUserDto,
      };

      mockTestRepository.findOne.mockResolvedValue(oldUser);
      mockTestRepository.save.mockResolvedValue(newUser);

      const result = await service.updateUser(idUser, updateUserDto);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idUser },
      });

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(newUser);

      expect(result).toEqual(newUser);
    });

    it('should throw an error if the user does not exist', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      idUser = 'falseId';

      mockTestRepository.findOne.mockResolvedValue(null);

      expect(async () => {
        await service.updateUser(idUser, updateUserDto);
      }).rejects.toThrow(NotFoundException);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.save).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  describe('getUsers', () => {
    it('should get all users', async () => {
      const numberUsers = 3;
      const users: User[] = getUsersMock(numberUsers);

      mockTestRepository.find.mockResolvedValue(users);

      const result = await service.getUsers();

      expect(mockTestRepository.find).toHaveBeenCalled();

      expect(result).toEqual(users);
    });
  });

  describe('getUserByUsername', () => {
    let listUsers: User[];
    let user: User;
    let username: string;

    beforeEach(() => {
      listUsers = getUsersMock(3);
      user = generateUser({
        email: 'Test@email.com',
        password: 'test1234',
        username: 'marina',
      });

      listUsers = listUsers.concat(user);

      mockTestRepository.findOne.mockImplementation(
        ({ where: { username } }: { where: { username: string } }) =>
          listUsers.find((userList) => userList.username === username),
      );
    });

    it('should get user by username', async () => {
      username = user.username;

      const result = await service.getUserByUsername(username);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });

      expect(result).toEqual(user);
    });

    it('should throw an error when user is not found', async () => {
      username = 'false_username_123';

      expect(async () => {
        await service.getUserByUsername(username);
      }).rejects.toThrow(NotFoundException);

      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
    });
  });

  describe('getUserById', () => {
    let listUsers: User[];
    let user: User;
    let idUser: string;

    beforeEach(() => {
      listUsers = getUsersMock(3);
      user = generateUser({
        email: 'Test@email.com',
        password: 'test1234',
        username: 'marina',
      });

      listUsers = listUsers.concat(user);

      mockTestRepository.findOne.mockImplementation(
        ({ where: { id } }: { where: { id: string } }) =>
          listUsers.find((userList) => userList.id === id),
      );
    });

    it('should get user by username', async () => {
      idUser = user.id;

      const result = await service.getUserById(idUser);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idUser },
      });

      expect(result).toEqual(user);
    });

    it('should throw an error when user is not found', async () => {
      idUser = 'false_id_user_0987';

      expect(async () => {
        await service.getUserById(idUser);
      }).rejects.toThrow(NotFoundException);

      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idUser },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
