import { OmitType } from '@nestjs/mapped-types';
import { Task } from '../entity/tasks.entity';

export class CreateTaskDto {
  title: string;
  isCompleted: boolean;
  createdAt: Date;
}
