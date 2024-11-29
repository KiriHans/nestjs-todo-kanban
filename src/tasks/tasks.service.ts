import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Task } from './entity/tasks.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private taskRepository: Repository<Task>,
  ) {}

  async createTask(task: CreateTaskDto, user: User): Promise<Task> {
    // Create task database
    const newTask = this.taskRepository.create({ ...task, user });

    return this.taskRepository.save(newTask);
  }

  async deleteTask(id: string, user: User): Promise<void> {
    const tasks = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (tasks.user?.id !== user.id) {
      throw new ForbiddenException('Not allowed to delete this task');
    }
    // Delete task database
    await this.taskRepository.delete(id);
  }

  async updateTask(
    id: string,
    UpdateTaskDto: UpdateTaskDto,
    user: User,
  ): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!task) {
      throw new NotFoundException();
    }

    if (user.id !== task.user.id) {
      throw new ForbiddenException('Not allowed to update this task');
    }

    Object.assign(task, UpdateTaskDto);

    return await this.taskRepository.save(task);
  }

  async getTasks(user: User): Promise<Task[]> {
    // Get all user tasks
    // Posible to get using filters
    // Or pagination

    const tasks = await this.taskRepository.find({
      where: { user: { id: user.id } },
    });

    return tasks;
  }
}
