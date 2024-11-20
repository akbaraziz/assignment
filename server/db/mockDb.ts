import { Task } from '../../src/types/task';

class MockDatabase {
  private tasks: Task[] = [];
  private counter = 1;

  async findAll(): Promise<Task[]> {
    return [...this.tasks].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async create(taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const now = new Date().toISOString();
    const task: Task = {
      _id: String(this.counter++),
      ...taskData,
      createdAt: now,
      updatedAt: now
    };
    this.tasks.push(task);
    return task;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task | null> {
    const index = this.tasks.findIndex(task => task._id === id);
    if (index === -1) return null;
    
    const now = new Date().toISOString();
    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: now
    };
    return this.tasks[index];
  }
}

export const mockDb = new MockDatabase();