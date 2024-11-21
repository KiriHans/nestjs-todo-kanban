import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { PostgresErrorCode } from 'src/database/postgresErrorCodes.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.userRepository.create(createUserDto);
    await this.userRepository.save(newUser);
    return newUser;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);

    return updatedUser;
  }

  async getUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    if (user) return user;
    throw new NotFoundException('User with this email does not exist');
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findOne({ where: { id } });

    if (user) return user;
    throw new NotFoundException('User with this id does not exist');
  }
}
