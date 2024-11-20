import React from 'react';
import { CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Task } from '../types/task';

interface TaskListProps {
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  isLoading: boolean;
}

export default function TaskList({ tasks, onStatusChange, isLoading }: TaskListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-indigo-100">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        <p className="mt-4 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-indigo-100">
        <AlertCircle className="w-16 h-16 text-gray-400" />
        <p className="mt-4 text-lg text-gray-600">No tasks yet. Add your first task!</p>
      </div>
    );
  }

  const getStatusIcon = (status: Task['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-amber-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="group bg-white rounded-xl shadow-sm border border-indigo-100 p-6 hover:shadow-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                {getStatusIcon(task.status)}
                <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
              </div>
              <p className="mt-2 text-gray-600">{task.description}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                <span className={`px-2.5 py-0.5 rounded-full border ${getPriorityColor(task.priority)}`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className="text-gray-500">
                  Due: {new Date(task.dueDate).toLocaleDateString()}
                </span>
              </div>
            </div>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value as Task['status'])}
              className="ml-4 rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}