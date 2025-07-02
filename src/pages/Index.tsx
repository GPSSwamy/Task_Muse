
import React, { useState } from 'react';
import Dashboard from '@/components/Dashboard';
import TaskList from '@/components/TaskList';
import CalendarView from '@/components/CalendarView';
import AIChat from '@/components/AIChat';
import Navigation from '@/components/Navigation';
import VoiceCommands from '@/components/VoiceCommands';
import NotificationSystem from '@/components/NotificationSystem';
import { AuthProvider } from '@/components/AuthContext';
import { Task } from '@/types/Task';

const Index = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: 'Review project proposal',
      description: 'Review and provide feedback on the Q4 project proposal',
      priority: 'high' as const,
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      completed: false,
      category: 'work',
      recurring: false
    },
    {
      id: 2,
      title: 'Team meeting',
      description: 'Weekly team sync-up meeting',
      priority: 'medium' as const,
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
      completed: false,
      category: 'meetings',
      recurring: true,
      recurringType: 'weekly' as const
    },
    {
      id: 3,
      title: 'Complete workout',
      description: 'Morning cardio session',
      priority: 'low' as const,
      dueDate: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours from now
      completed: true,
      category: 'personal',
      recurring: true,
      recurringType: 'daily' as const
    }
  ]);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard tasks={tasks} setTasks={setTasks} />;
      case 'tasks':
        return <TaskList tasks={tasks} setTasks={setTasks} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'chat':
        return <AIChat tasks={tasks} setTasks={setTasks} />;
      default:
        return <Dashboard tasks={tasks} setTasks={setTasks} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Navigation Sidebar */}
            <div className="lg:w-64 flex-shrink-0">
              <Navigation activeView={activeView} setActiveView={setActiveView} />
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1">
              {renderActiveView()}
            </div>
            
            {/* AI Chat Sidebar */}
            <div className="lg:w-80 flex-shrink-0">
              <div className="sticky top-6">
                <AIChat tasks={tasks} setTasks={setTasks} />
              </div>
            </div>
          </div>
        </div>
        
        {/* Fixed Components */}
        <VoiceCommands tasks={tasks} setTasks={setTasks} />
        <NotificationSystem tasks={tasks} />
      </div>
    </AuthProvider>
  );
};

export default Index;
