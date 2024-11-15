import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  createUser(createUserDto: CreateUserDto) {
    return 'This action adds a new user';
  }

  updateUser(updateUserDto: UpdateUserDto) {
    return 'This action updates a current user';
  }

  getUsers() {
    return `This action returns all user`;
  }

  getUserByUsername(username: string) {
    return `This action returns a #${username}`;
  }

  getUserById(id: string) {
    return `This action returns a #${id} user`;
  }
}
