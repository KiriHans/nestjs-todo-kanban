import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(16)
  username: string;

  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(32)
  password: string;
}
