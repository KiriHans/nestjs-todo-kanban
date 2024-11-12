import { Injectable } from '@nestjs/common';

@Injectable()
export class TasksService {
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
