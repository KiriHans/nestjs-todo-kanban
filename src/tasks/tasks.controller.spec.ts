import { Test, TestingModule } from '@nestjs/testing';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { generateTask, getTasksMock } from './utils-test';
import { Task } from './entity/tasks.entity';
import { UpdateTaskDto } from './dto/update-task.dto';

const TASKS_LIST: Readonly<Task[]> = getTasksMock(3);

const mockTasksService = {
  getTasks: jest.fn<any, Task[]>().mockResolvedValue([...TASKS_LIST] as const),
  createTask: jest.fn(),
  updateTask: jest.fn(),
  deleteTask: jest.fn(),
};

describe('TasksController', () => {
  let controller: TasksController;

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

    controller = module.get<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should findAll tasks', async () => {
    const result = await controller.findAll();

    expect(result).toEqual(TASKS_LIST);

    expect(mockTasksService.getTasks).toHaveBeenCalled();
  });

  it('Should update task given id and body', async () => {
    const [idTask, body]: [string, UpdateTaskDto] = [
      'testID',
      {
        title: 'New title',
      },
    ];

    const updatedTask = generateTask({
      title: body.title ?? 'Old title',
      isCompleted: body.isCompleted ?? false,
    });

    mockTasksService.updateTask.mockResolvedValue(updatedTask);

    const result = await controller.updateTask(idTask, body);

    expect(result).toEqual(updatedTask);

    expect(mockTasksService.updateTask).toHaveBeenCalledWith(idTask, body);
  });

  it('Should delete tasks by id', async () => {
    const idTask = 'testID';

    await controller.deleteTask(idTask);

    expect(mockTasksService.deleteTask).toHaveBeenCalledWith(idTask);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
