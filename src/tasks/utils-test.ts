import { User } from 'src/user/entities/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entity/tasks.entity';

const NUMBER_OF_TASKS = 3;

export function generateTask(
  { title, isCompleted }: CreateTaskDto,
  user: User,
): Task {
  return {
    createdAt: new Date(),
    updatedAt: new Date(),
    id: globalThis.crypto.randomUUID(),
    title,
    isCompleted,
    user,
  };
}

export function getTasksMock(length: number, user: User): Readonly<Task[]> {
  return Array.from({ length }, (_, index) =>
    generateTask(
      {
        title: `Test Title ${index}`,
        isCompleted: Math.floor(Math.random() * 2) === 0,
      },
      user,
    ),
  );
}
