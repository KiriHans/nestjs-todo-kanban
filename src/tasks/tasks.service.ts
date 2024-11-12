import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
  ) {}

  createTask(task: CreateTaskDto) {
    // Create task database
    const newTask = this.taskRepository.create(task);
    return newTask;
  }

  deleteTask() {
    // Delete task database
    return 'Task deleted';
  }

  updateTask() {
    // Update task database
    return 'Task updated';
  }

  async getTasks(): Promise<Task[]> {
    // Get all user tasks
    // Posible to get using filters
    // Or pagination
    return this.taskRepository.find({
      where: {},
    });
  }
}
