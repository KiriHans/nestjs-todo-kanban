import { Controller, Delete, Get, Patch, Post, Query } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  // GET tasks
  @Get()
  findAll(@Query('sort') sort: 'asc' | 'desc' = 'desc'): string {
    return 'All tasks';
  }

  // POST tasks
  @Post(':id')
  createTask(): string {
    return 'Task created';
  }
  // PATCH tasks
  @Patch()
  updateTask(): string {
    return 'Task updated';
  }

  // DELETE tasks
  @Delete()
  deleteTask(): string {
    return 'Task deleted';
  }
}
