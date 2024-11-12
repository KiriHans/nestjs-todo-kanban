import { Task } from './tasks.entity';

describe('Entity', () => {
  it('should be defined', () => {
    expect(new Task()).toBeDefined();
  });
});
