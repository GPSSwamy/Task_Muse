
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Calendar, Clock, Repeat, Edit2, Trash2 } from 'lucide-react';
import TaskModal from './TaskModal';

interface Task {
  id: number;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  dueDate: Date;
  completed: boolean;
  category: string;
  recurring?: boolean;
  recurringType?: string;
}

interface TaskListProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const TaskList = ({ tasks, setTasks }: TaskListProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
            <p className="text-gray-600">Organize and track your tasks efficiently</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        {/* Filters */}
        <div className="flex gap-2 mt-4">
          {(['all', 'pending', 'completed'] as const).map(filterType => (
            <Badge
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              className="cursor-pointer capitalize"
              onClick={() => setFilter(filterType)}
            >
              {filterType}
            </Badge>
          ))}
        </div>
      </Card>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg hover:shadow-xl transition-shadow">
            <div className="flex items-start gap-4">
              <Checkbox
                checked={task.completed}
                onCheckedChange={() => toggleTaskCompletion(task.id)}
                className="mt-1"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    <p className={`text-sm mt-1 ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
                      {task.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditModal(task)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteTask(task.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-3">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="h-3 w-3" />
                    {task.dueDate.toLocaleDateString()}
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-3 w-3" />
                    {task.dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  
                  {task.recurring && (
                    <div className="flex items-center gap-1 text-sm text-blue-600">
                      <Repeat className="h-3 w-3" />
                      {task.recurringType}
                    </div>
                  )}
                  
                  <Badge variant="outline" className="text-xs">
                    {task.category}
                  </Badge>
                </div>
              </div>
            </div>
          </Card>
        ))}
        
        {filteredTasks.length === 0 && (
          <Card className="p-8 text-center backdrop-blur-sm bg-white/70 border-0 shadow-lg">
            <p className="text-gray-500">No tasks found. Create your first task to get started!</p>
          </Card>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={closeModal}
        task={editingTask}
        onSave={(task) => {
          if (editingTask) {
            setTasks(tasks.map(t => t.id === editingTask.id ? { ...task, id: editingTask.id } : t));
          } else {
            setTasks([...tasks, { ...task, id: Date.now() }]);
          }
          closeModal();
        }}
      />
    </div>
  );
};

export default TaskList;
