import { Injectable } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  signup(authDto: AuthDto) {}

  signin(authDto: AuthDto) {}
}
