import axios from 'axios';
import { CreateTaskInput, Task } from '../types/task';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getTasks = async (): Promise<Task[]> => {
  try {
    const response = await api.get<Task[]>('/tasks');
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw new Error('Failed to fetch tasks');
  }
};

export const createTask = async (task: CreateTaskInput): Promise<Task> => {
  try {
    const response = await api.post<Task>('/tasks', task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task');
  }
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  try {
    const response = await api.patch<Task>(`/tasks/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    throw new Error('Failed to update task');
  }
};