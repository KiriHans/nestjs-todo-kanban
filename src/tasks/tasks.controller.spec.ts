import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { generateTask, getTasksMock } from './utils-test';
import { Task } from './entity/tasks.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { USER_LIST } from 'src/user/util-user-test';
import { RequestWithUser } from 'src/auth/interfaces/request-user.interface';
import { User } from 'src/user/entities/user.entity';

const USER = [...USER_LIST][0];
const TASKS_LIST: Readonly<Task[]> = getTasksMock(3, USER);

const mockTasksService = {
  getTasks: jest.fn<any, Task[]>().mockResolvedValue([...TASKS_LIST] as const),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;
  let reqMock: RequestWithUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TasksController],
      providers: [
        {
          provide: TasksService,
          useValue: mockTasksService,
        },
      ],
    }).compile();

    reqMock = {
      user: { ...USER },
    } as unknown as RequestWithUser;
    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should findAll tasks', async () => {
    const result = await controller.findAll(reqMock);

    expect(result).toEqual(TASKS_LIST);

    expect(mockTasksService.getTasks).toHaveBeenCalledWith(USER);
  });

  it('Should update task given id and body', async () => {
    const [idTask, body]: [string, UpdateTaskDto] = [
      'testID',
      {
        title: 'New title',
      },
    ];

    const updatedTask = generateTask(
      {
        title: body.title ?? 'Old title',
        isCompleted: body.isCompleted ?? false,
      },
      USER,
    );

    mockTasksService.updateTask.mockResolvedValue(updatedTask);

    const result = await controller.updateTask(idTask, body, reqMock);

    expect(result).toEqual(updatedTask);

    expect(mockTasksService.updateTask).toHaveBeenCalledWith(
      idTask,
      body,
      USER,
    );
  });

  it('Should delete tasks by id', async () => {
    const idTask = 'testID';

    await controller.deleteTask(idTask, reqMock);

    expect(mockTasksService.deleteTask).toHaveBeenCalledWith(idTask, USER);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
