import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';

import { UserService } from 'src/user/user.service';
import * as argon from 'argon2';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';
import { RegisterDto } from './dto/register.dto';
import { LoginWithUsernameDto } from './dto/login-username.dto';
import { User } from 'src/user/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUserByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    const isPassworMatching = await argon.verify(user.password, password);

    if (!isPassworMatching) {
      throw new UnauthorizedException('Credentials incorrect');
    }

    return user;
  }

  async register(registrationDto: RegisterDto) {
    const hash = await argon.hash(registrationDto.password);

    try {
      const user = await this.userService.createUser({
        ...registrationDto,
        password: hash,
      });

      return user;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new ForbiddenException('Credentials taken');
      }

      throw new InternalServerErrorException();
    }
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.signAsync(payload),
    };
  }
}
