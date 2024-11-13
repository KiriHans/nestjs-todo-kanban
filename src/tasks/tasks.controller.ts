import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/tasks.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET tasks
  @Get()
  async findAll(): Promise<Task[]> {
    return this.tasksService.getTasks();
  }

  // POST tasks
  @Post()
  async createTask(@Body(ValidationPipe) newTask: CreateTaskDto) {
    return this.tasksService.createTask(newTask);
  }
  // PATCH tasks
  @Patch(':id')
  updateTask(): string {
    return this.tasksService.updateTask();
  }

  // DELETE tasks
  @Delete(':id')
  deleteTask(): string {
    return this.tasksService.deleteTask();
  }
}
