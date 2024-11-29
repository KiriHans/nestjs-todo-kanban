import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  Request,
  ValidationPipe,
  ClassSerializerInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/tasks.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PassportJwtGuard } from 'src/auth/guards/passport-jwt.guard';
import { RequestWithUser } from 'src/auth/interfaces/request-user.interface';

@UseInterceptors(ClassSerializerInterceptor)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET tasks
  @Get()
  @UseGuards(PassportJwtGuard)
  async findAll(@Request() req: RequestWithUser): Promise<Task[]> {
    const { user } = req;
    return this.tasksService.getTasks(user);
  }

  // POST tasks
  @Post()
  @UseGuards(PassportJwtGuard)
  async createTask(
    @Body(ValidationPipe) newTask: CreateTaskDto,
    @Request() req: RequestWithUser,
  ) {
    const { user } = req;
    return this.tasksService.createTask(newTask, user);
  }
  // PATCH tasks
  @Patch(':id')
  @UseGuards(PassportJwtGuard)
  updateTask(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedTask: UpdateTaskDto,
    @Request() req: RequestWithUser,
  ): Promise<Task> {
    const { user } = req;
    return this.tasksService.updateTask(id, updatedTask, user);
  }

  // DELETE tasks
  @Delete(':id')
  @UseGuards(PassportJwtGuard)
  deleteTask(
    @Param('id') id: string,
    @Request() req: RequestWithUser,
  ): Promise<void> {
    const { user } = req;
    return this.tasksService.deleteTask(id, user);
  }
}
