import React from 'react';
import { PlusCircle } from 'lucide-react';
import { Task } from '../types/task';

interface TaskFormProps {
  onSubmit: (task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const task = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      status: 'todo' as const,
      priority: formData.get('priority') as Task['priority'],
      dueDate: formData.get('dueDate') as string,
    };

    onSubmit(task);
    e.currentTarget.reset();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-indigo-100 p-6 space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          required
          id="title"
          name="title"
          type="text"
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          required
          id="description"
          name="description"
          rows={3}
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          placeholder="Describe your task"
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">Priority</label>
        <select
          id="priority"
          name="priority"
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
          defaultValue="medium"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
        <input
          required
          id="dueDate"
          name="dueDate"
          type="date"
          className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2"
        />
      </div>

      <button
        type="submit"
        className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
      >
        <PlusCircle className="w-5 h-5 mr-2" />
        Add Task
      </button>
    </form>
  );
}