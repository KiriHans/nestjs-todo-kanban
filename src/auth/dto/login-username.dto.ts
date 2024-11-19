import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';
import { IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class LoginWithUsernameDto {
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(32)
  password: string;
}
