import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/tasks.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

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
  updateTask(
    @Param('id') id: string,
    @Body(ValidationPipe) updatedTask: UpdateTaskDto,
  ): Promise<Task> {
    return this.tasksService.updateTask(id, updatedTask);
  }

  // DELETE tasks
  @Delete(':id')
  deleteTask(@Param('id') id: string): Promise<void> {
    return this.tasksService.deleteTask(id);
  }
}
