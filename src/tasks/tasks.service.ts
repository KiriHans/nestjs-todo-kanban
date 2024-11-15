import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createTask(task: CreateTaskDto): Promise<Task> {
    // Create task database
    const newTask = this.taskRepository.create({ ...task });

    return this.taskRepository.save(newTask);
  }

  async deleteTask(id: string): Promise<void> {
    // Delete task database
    await this.taskRepository.delete(id);
  }

  async updateTask(id: string, UpdateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.taskRepository.findOne({ where: { id } });
    if (!task) {
      throw new NotFoundException();
    }

    Object.assign(task, UpdateTaskDto);

    return await this.taskRepository.save(task);
  }

  async getTasks(): Promise<Task[]> {
    // Get all user tasks
    // Posible to get using filters
    // Or pagination
    return await this.taskRepository.find();
  }
}
