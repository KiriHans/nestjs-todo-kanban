import { PickType } from '@nestjs/mapped-types';
import { RegisterDto } from './register.dto';

export class LoginWithUsernameDto extends PickType(RegisterDto, [
  'username',
  'password',
] as const) {}
