import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  createTask() {
    // Create task database
    return 'Task created';
  }

  deleteTask() {
    // Delete task database
    return 'Task deleted';
  }

  updateTask() {
    // Update task database
    return 'Task updated';
  }

  getTasks() {
    // Get all user tasks
    // Posible to get using filters
    // Or pagination
    return 'Task found';
  }
}
