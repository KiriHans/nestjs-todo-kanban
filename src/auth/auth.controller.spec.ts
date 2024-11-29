import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { generateUser } from 'src/user/util-user-test';
import { RegisterDto } from './dto/register.dto';
import { User } from 'src/user/entities/user.entity';
import { RequestWithUser } from './interfaces/request-user.interface';
import { Response } from 'express';

type AuthServiceMock = {
  login: jest.Mock<any, any, any>;
  register: jest.Mock<any, any, any>;
};

describe('AuthController', () => {
  let controller: AuthController;
  let authServiceMock: AuthServiceMock;
  let registerDto: RegisterDto;
  let userTest: User;

  beforeEach(async () => {
    const unhashedPassword = 'testPassword123';

    registerDto = {
      email: 'test_email@email.com',
      password: unhashedPassword,
      username: 'testusername',
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            register: jest
              .fn()
              .mockImplementation(async (registerDto: RegisterDto) => {
                userTest = generateUser({
                  ...registerDto,
                });

                return userTest;
              }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authServiceMock = module.get<AuthServiceMock>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register the user', async () => {
      const result = await controller.register({ ...registerDto });

      expect(result).toEqual(userTest);

      expect(authServiceMock.register).toHaveBeenCalled();
      expect(authServiceMock.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('login', () => {
    it('should login user', async () => {
      userTest = generateUser({
        ...registerDto,
      });

      const reqMock: RequestWithUser = {
        user: { ...userTest },
      } as unknown as RequestWithUser;

      const resMock: Response = {} as unknown as Response;

      const tokenObj = {
        access_token: 'test_token',
      };

      authServiceMock.login.mockResolvedValue(tokenObj);

      const result = await controller.login(reqMock, resMock);

      expect(authServiceMock.login).toHaveBeenCalled();
      expect(authServiceMock.login).toHaveBeenCalledWith(reqMock.user, resMock);

      expect(result).toEqual(tokenObj);
    });
  });
});
