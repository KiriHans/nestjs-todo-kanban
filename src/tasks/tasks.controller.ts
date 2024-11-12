import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  // GET tasks
  @Get()
  findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc'): string {
    return this.tasksService.getTasks();
  }

  // POST tasks
  @Post(':id')
  createTask(): string {
    return this.tasksService.createTask();
  }
  // PATCH tasks
  @Patch()
  updateTask(): string {
    return this.tasksService.updateTask();
  }

  // DELETE tasks
  @Delete()
  deleteTask(): string {
    return this.tasksService.deleteTask();
  }
}
