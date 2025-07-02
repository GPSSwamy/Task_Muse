
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Calendar, Clock, TrendingUp, CheckCircle, AlertTriangle, Target } from 'lucide-react';

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

interface DashboardProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const Dashboard = ({ tasks }: DashboardProps) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const upcomingTasks = tasks
    .filter(task => !task.completed && task.dueDate > new Date())
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
    .slice(0, 3);
    
  const overdueTasks = tasks.filter(task => !task.completed && task.dueDate < new Date());
  
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high' && !task.completed).length,
    medium: tasks.filter(task => task.priority === 'medium' && !task.completed).length,
    low: tasks.filter(task => task.priority === 'low' && !task.completed).length
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Good morning! 👋</h2>
            <p className="text-blue-100">You have {upcomingTasks.length} tasks due today. Let's make it productive!</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{completionRate.toFixed(0)}%</div>
            <div className="text-sm text-blue-100">Completion Rate</div>
          </div>
        </div>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{upcomingTasks.length}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{overdueTasks.length}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{priorityStats.high}</div>
              <div className="text-sm text-gray-600">High Priority</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Progress Section */}
      <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Progress Overview</h3>
        </div>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-gray-600">{completedTasks}/{totalTasks} tasks</span>
            </div>
            <Progress value={completionRate} className="h-3" />
          </div>
        </div>
      </Card>

      {/* Upcoming Tasks */}
      <Card className="p-6 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Upcoming Tasks</h3>
        </div>
        <div className="space-y-3">
          {upcomingTasks.length > 0 ? upcomingTasks.map((task) => (
            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{task.title}</h4>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={task.priority === 'high' ? 'destructive' : task.priority === 'medium' ? 'default' : 'secondary'}>
                  {task.priority}
                </Badge>
                <span className="text-xs text-gray-500">
                  {task.dueDate.toLocaleDateString()}
                </span>
              </div>
            </div>
          )) : (
            <p className="text-gray-500 text-center py-4">No upcoming tasks. Great job! 🎉</p>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
