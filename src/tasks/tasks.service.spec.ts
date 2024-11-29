import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entity/tasks.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { NotFoundException } from '@nestjs/common';
import { generateTask } from './utils-test';
import { USER_LIST } from 'src/user/util-user-test';

const mockTestRepository = {
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
};

const USER = [...USER_LIST][0];

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTestRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new task and return its data', async () => {
    const createTaskDto: CreateTaskDto = {
      isCompleted: false,
      title: 'Test title',
    };

    const createTaskClass = new Task();
    Object.assign(createTaskClass, createTaskDto);

    const task: Task = generateTask({ ...createTaskDto }, { ...USER });

    jest.spyOn(mockTestRepository, 'create').mockReturnValue(createTaskDto);
    jest.spyOn(mockTestRepository, 'save').mockReturnValue(task);

    const result = await service.createTask(createTaskDto, { ...USER });

    expect(mockTestRepository.create).toHaveBeenCalled();
    expect(mockTestRepository.create).toHaveBeenCalledWith({
      ...createTaskDto,
      user: USER,
    });

    expect(mockTestRepository.save).toHaveBeenCalled();
    expect(mockTestRepository.save).toHaveBeenCalledWith(createTaskClass);

    expect(result).toEqual(task);
  });

  describe('updateTask', () => {
    let oldTask: Task;
    let idTask: string;
    beforeEach(() => {
      oldTask = generateTask(
        {
          title: 'Old title',
          isCompleted: false,
        },
        { ...USER },
      );

      idTask = oldTask.id;
    });

    it('Should update task title and return the updated task with the new title', async () => {
      const updateTaskDto: UpdateTaskDto = {
        title: 'New Title',
      };

      const newTask: Task = {
        ...oldTask,
        title: updateTaskDto.title,
      };

      jest.spyOn(mockTestRepository, 'findOne').mockReturnValue(oldTask);
      jest.spyOn(mockTestRepository, 'save').mockReturnValue(newTask);

      const result = await service.updateTask(idTask, updateTaskDto, {
        ...USER,
      });

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idTask },
        relations: ['user'],
      });

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(oldTask);

      expect(result).toEqual(newTask);
    });

    it('Should update task completed state and return the update task', async () => {
      const updateTaskDto: UpdateTaskDto = {
        isCompleted: !oldTask.isCompleted,
      };

      const newTask: Task = {
        ...oldTask,
        isCompleted: updateTaskDto.isCompleted,
      };

      jest.spyOn(mockTestRepository, 'findOne').mockReturnValue(oldTask);
      jest.spyOn(mockTestRepository, 'save').mockReturnValue(newTask);

      const result = await service.updateTask(idTask, updateTaskDto, {
        ...USER,
      });

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.findOne).toHaveBeenCalledWith({
        where: { id: idTask },
        relations: ['user'],
      });

      expect(mockTestRepository.save).toHaveBeenCalled();
      expect(mockTestRepository.save).toHaveBeenCalledWith(oldTask);

      expect(result).toEqual(newTask);
    });

    it('Should throw an error if the task does not exist', async () => {
      const updateTaskDto: UpdateTaskDto = {
        isCompleted: !oldTask.isCompleted,
      };

      idTask = 'falseId';

      jest.spyOn(mockTestRepository, 'findOne').mockReturnValue(null);
      jest.spyOn(mockTestRepository, 'save');

      expect(async () => {
        await service.updateTask('falseId', updateTaskDto, { ...USER });
      }).rejects.toThrow(NotFoundException);

      expect(mockTestRepository.findOne).toHaveBeenCalled();
      expect(mockTestRepository.save).not.toHaveBeenCalled();
    });

    afterEach(() => {
      jest.clearAllMocks();
    });
  });

  it('Should delete task by id', async () => {
    const idTask = 'TestId';
    const createTaskDto: CreateTaskDto = {
      isCompleted: false,
      title: 'Test title',
    };
    const taskTest: Task = generateTask({ ...createTaskDto }, { ...USER });

    jest.spyOn(mockTestRepository, 'delete');

    mockTestRepository.findOne.mockResolvedValue({ ...taskTest, user: USER });

    await service.deleteTask(idTask, { ...USER });

    expect(mockTestRepository.delete).toHaveBeenCalled();
    expect(mockTestRepository.delete).toHaveBeenCalledWith(idTask);
  });

  it('Should get all task', async () => {
    const taskList = [
      generateTask({ title: 'Title 1', isCompleted: false }, { ...USER }),
      generateTask({ title: 'Title 2', isCompleted: true }, { ...USER }),
      generateTask({ title: 'Title 3', isCompleted: false }, { ...USER }),
    ];

    jest.spyOn(mockTestRepository, 'find').mockReturnValue(taskList);

    const result = await service.getTasks({ ...USER });

    expect(mockTestRepository.find).toHaveBeenCalled();
    expect(result).toEqual(taskList);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
