import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../user/entities/user.entity';

import {
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { RegisterDto } from './dto/register.dto';
import { Payload } from './interfaces/payload-token.interface';

import {
  generateUser,
  getMockUserService,
  MockUserType,
} from 'src/user/util-user-test';

import * as argon from 'argon2';
import { QueryFailedError } from 'typeorm';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

type MockJwtService = {
  signAsync: jest.Mock<any, any, any>;
};

const EXPIRATION_TYPE = 100;

function simulateUniqueConstraintError({ email }: RegisterDto) {
  const errorMessage =
    'duplicate key value violates unique constraint "UQ_78a916df40e02a9deb1c4b75edb"';
  const query = 'INSERT INTO users (email) VALUES ($1)';
  const parameters = [email];

  const error = new Error(errorMessage);

  error['code'] = '23505'; // Postgres unique constraint violation code

  throw new QueryFailedError(query, parameters, error);
}
describe('AuthService', () => {
  let authService: AuthService;
  let userServiceMock: MockUserType;
  let jwtServiceMock: MockJwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: getMockUserService(),
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockImplementation((key: string) => {
              if (key === 'JWT_EXPIRATION_TIME') return EXPIRATION_TYPE;
            }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userServiceMock = module.get<MockUserType>(UserService);
    jwtServiceMock = module.get<MockJwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should validate user and return the user object', async () => {
      const unhashedPassword = 'testPassword123';
      const testUser: User = generateUser({
        email: 'test_email@email.com',
        password: await argon.hash(unhashedPassword),
        username: 'testusername',
      });

      const { username } = testUser;

      userServiceMock.getUserByUsername.mockResolvedValue(testUser);

      const result = await authService.validateUser(username, unhashedPassword);

      expect(userServiceMock.getUserByUsername).toHaveBeenCalled();
      expect(userServiceMock.getUserByUsername).toHaveBeenCalledWith(username);

      expect(result).toEqual(testUser);
    });

    it('should throw an UnauthorizedException if the user cannot be found', async () => {
      const unhashedPassword = 'testPassword123';
      const testUser: User = generateUser({
        email: 'test_email@email.com',
        password: await argon.hash(unhashedPassword),
        username: 'testusername',
      });

      userServiceMock.getUserByUsername.mockResolvedValue(null);

      expect(async () => {
        await authService.validateUser(testUser.username, unhashedPassword);
      }).rejects.toThrow(UnauthorizedException);
    });

    it('should throw an UnauthorizedException if the password does not match', async () => {
      const unhashedPassword = 'testPassword123';
      const testUser: User = generateUser({
        email: 'test_email@email.com',
        password: await argon.hash(unhashedPassword),
        username: 'testusername',
      });

      userServiceMock.getUserByUsername.mockResolvedValue(testUser);

      expect(async () => {
        await authService.validateUser(testUser.username, 'fakePassword0_');
      }).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    let registrationDtoTest: RegisterDto;

    beforeEach(async () => {
      const unhashedPassword = 'testPassword123';

      registrationDtoTest = {
        email: 'test_email@email.com',
        password: unhashedPassword,
        username: 'testusername',
      };
    });

    it('should register user and return the user object', async () => {
      const testUser: User = generateUser({
        ...registrationDtoTest,
      });
      userServiceMock.createUser.mockResolvedValue(testUser);

      const result = await authService.register(registrationDtoTest);

      expect(userServiceMock.createUser).toHaveBeenCalled();

      expect(result).toEqual(testUser);
    });

    it('should throw an error when the username or email are taken', async () => {
      userServiceMock.createUser.mockImplementation(
        async (createUserDto: CreateUserDto) => {
          simulateUniqueConstraintError(createUserDto);
        },
      );

      expect(async () => {
        await authService.register(registrationDtoTest);
      }).rejects.toThrow(ForbiddenException);
    });

    it('should throw an error when an unexpected error while creating user happens', async () => {
      const errorCode = 500; // Internal Server Error;
      await userServiceMock.createUser.mockImplementation(async () => {
        throw new HttpException('Server Error', errorCode);
      });

      await expect(async () => {
        await authService.register(registrationDtoTest);
      }).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('login', () => {
    it('should login and return a token', async () => {
      const userTest = generateUser({
        email: 'testEmail@email.com',
        password: 'testPassword123',
        username: 'testUsername_',
      });

      const testResponse: Response<any, Record<string, any>> = {
        cookie: jest.fn(),
      } as unknown as Response;
      const testToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6InRlc3RVc2VybmFtZV8iLCJpYXQiOjE1MTYyMzkwMjJ9.G_ODS9QPfIGU-ic0gDkGu7J49XYl1EJNAq-liwlr9kk';

      const payload: Payload = {
        sub: userTest.id,
        username: userTest.username,
      };

      jwtServiceMock.signAsync.mockResolvedValue(testToken);

      const result = await authService.login(userTest, testResponse);

      expect(jwtServiceMock.signAsync).toHaveBeenCalled();
      expect(jwtServiceMock.signAsync).toHaveBeenCalledWith(payload);

      expect(testResponse.cookie).toHaveBeenCalled();
      expect(testResponse.cookie).toHaveBeenCalledWith(
        'authentication',
        testToken,
        {
          maxAge: EXPIRATION_TYPE * 1000,
          httpOnly: true,
        },
      );

      expect(result).toEqual({ access_token: testToken });
    });
  });
});
