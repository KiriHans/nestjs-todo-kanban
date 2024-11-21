import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUsers() {
    return this.userService.getUsers();
  }

  @Patch(':id')
  @UseGuards(PassportJwtGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.userService.(+id);
  // }
}
