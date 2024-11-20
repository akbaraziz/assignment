import React, { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskList from './TaskList';
import { Task } from '../types/task';
import { getTasks, createTask, updateTask } from '../api/tasks';

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      setError('Failed to load tasks. Please try again later.');
      console.error('Error loading tasks:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTask = async (taskData: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newTask = await createTask(taskData);
      setTasks(prev => [newTask, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      console.error('Error creating task:', err);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: Task['status']) => {
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      setTasks(prev => prev.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      setError(null);
    } catch (err) {
      setError('Failed to update task status. Please try again.');
      console.error('Error updating task:', err);
    }
  };

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <TaskForm onSubmit={handleAddTask} />
        </div>
        <div className="lg:col-span-2">
          <TaskList 
            tasks={tasks} 
            onStatusChange={handleStatusChange} 
            isLoading={isLoading} 
          />
        </div>
      </div>
    </div>
  );
}