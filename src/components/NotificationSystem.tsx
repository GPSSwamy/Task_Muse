
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Bell, Clock, AlertTriangle } from 'lucide-react';

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

interface NotificationSystemProps {
  tasks: Task[];
}

const NotificationSystem = ({ tasks }: NotificationSystemProps) => {
  const [notifiedTasks, setNotifiedTasks] = useState<Set<number>>(new Set());
  const [lastMotivationTime, setLastMotivationTime] = useState<number>(0);

  useEffect(() => {
    const checkNotifications = () => {
      const now = new Date();
      const currentTime = now.getTime();

      // Check for task reminders (30 minutes before due)
      tasks.forEach(task => {
        if (task.completed || notifiedTasks.has(task.id)) return;

        const timeDiff = task.dueDate.getTime() - currentTime;
        const thirtyMinutes = 30 * 60 * 1000;
        const oneHour = 60 * 60 * 1000;

        // Notify 30 minutes before due time
        if (timeDiff > 0 && timeDiff <= thirtyMinutes) {
          toast.info(
            `⏰ Reminder: "${task.title}" is due in 30 minutes!`,
            {
              description: task.description,
              duration: 8000,
              action: {
                label: 'View',
                onClick: () => console.log('Navigate to task')
              }
            }
          );
          setNotifiedTasks(prev => new Set(prev).add(task.id));
        }

        // Notify for overdue tasks
        if (timeDiff < 0 && Math.abs(timeDiff) <= oneHour && !notifiedTasks.has(task.id + 1000)) {
          toast.error(
            `🚨 Overdue: "${task.title}" was due ${Math.floor(Math.abs(timeDiff) / (60 * 1000))} minutes ago`,
            {
              description: 'Consider rescheduling or completing this task',
              duration: 10000
            }
          );
          setNotifiedTasks(prev => new Set(prev).add(task.id + 1000));
        }
      });

      // Send motivational messages every 2 hours
      const twoHours = 2 * 60 * 60 * 1000;
      if (currentTime - lastMotivationTime > twoHours) {
        const completedToday = tasks.filter(task => {
          const taskDate = new Date(task.dueDate);
          const today = new Date();
          return task.completed && taskDate.toDateString() === today.toDateString();
        }).length;

        if (completedToday > 0) {
          const motivationalMessages = [
            `🎉 Amazing! You've completed ${completedToday} tasks today. Keep up the great work!`,
            `💪 You're on fire! ${completedToday} tasks done today. Your productivity is inspiring!`,
            `⭐ Fantastic progress! ${completedToday} tasks completed. You're crushing your goals!`,
            `🚀 Excellent work! ${completedToday} tasks finished today. You're unstoppable!`
          ];

          const randomMessage = motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
          
          toast.success(randomMessage, {
            duration: 6000,
            action: {
              label: 'Thanks!',
              onClick: () => console.log('Motivation acknowledged')
            }
          });
        } else if (Math.random() < 0.3) { // 30% chance to show general motivation
          const generalMotivation = [
            '🌟 Remember: Small progress is still progress. You got this!',
            '💡 Tip: Break down big tasks into smaller, manageable steps.',
            '🎯 Focus on what matters most. Prioritize your high-impact tasks!',
            '⚡ Take a short break when needed. Your mind deserves rest too!'
          ];

          const randomTip = generalMotivation[Math.floor(Math.random() * generalMotivation.length)];
          
          toast(randomTip, {
            duration: 5000,
            icon: '💭'
          });
        }

        setLastMotivationTime(currentTime);
      }
    };

    // Check notifications every minute
    const interval = setInterval(checkNotifications, 60000);
    
    // Initial check
    checkNotifications();

    return () => clearInterval(interval);
  }, [tasks, notifiedTasks, lastMotivationTime]);

  // Show welcome notification on first load
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem('taskMuse_welcomeShown');
    if (!hasShownWelcome) {
      setTimeout(() => {
        toast.success(
          '🎉 Welcome to TaskMuse AI!',
          {
            description: 'Your intelligent task management companion is ready to help you stay productive.',
            duration: 5000,
            action: {
              label: 'Got it!',
              onClick: () => localStorage.setItem('taskMuse_welcomeShown', 'true')
            }
          }
        );
      }, 2000);
      localStorage.setItem('taskMuse_welcomeShown', 'true');
    }
  }, []);

  return null; // This component doesn't render anything visible
};

export default NotificationSystem;
