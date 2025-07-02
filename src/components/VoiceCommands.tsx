
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { toast } from 'sonner';

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

interface VoiceCommandsProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const VoiceCommands = ({ tasks, setTasks }: VoiceCommandsProps) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if speech recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        console.log('Voice command:', transcript);
        handleVoiceCommand(transcript);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Voice recognition error. Please try again.');
      };

      setRecognition(recognitionInstance);
      setIsSupported(true);
    } else {
      console.log('Speech recognition not supported');
      setIsSupported(false);
    }
  }, []);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
    }
  };

  const handleVoiceCommand = (command: string) => {
    console.log('Processing command:', command);

    // Add task commands
    if (command.includes('add task') || command.includes('create task')) {
      const taskTitle = command.replace(/(add task|create task)\s*/i, '').trim();
      if (taskTitle) {
        const newTask: Task = {
          id: Date.now(),
          title: taskTitle,
          description: `Task created via voice command`,
          priority: 'medium',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          completed: false,
          category: 'work',
          recurring: false
        };
        setTasks([...tasks, newTask]);
        speak(`Task "${taskTitle}" has been added to your list.`);
        toast.success(`Added task: ${taskTitle}`);
      }
      return;
    }

    // Mark task complete
    if (command.includes('complete task') || command.includes('mark complete')) {
      const taskName = command.replace(/(complete task|mark complete)\s*/i, '').trim();
      const task = tasks.find(t => t.title.toLowerCase().includes(taskName) && !t.completed);
      if (task) {
        setTasks(tasks.map(t => t.id === task.id ? { ...t, completed: true } : t));
        speak(`Task "${task.title}" has been marked as complete. Great job!`);
        toast.success(`Completed: ${task.title}`);
      } else {
        speak('Sorry, I couldn\'t find that task or it\'s already completed.');
        toast.error('Task not found or already completed');
      }
      return;
    }

    // List tasks
    if (command.includes('list tasks') || command.includes('show tasks') || command.includes('what are my tasks')) {
      const incompleteTasks = tasks.filter(t => !t.completed);
      if (incompleteTasks.length > 0) {
        const taskList = incompleteTasks.slice(0, 3).map(t => t.title).join(', ');
        speak(`You have ${incompleteTasks.length} pending tasks. Here are the first few: ${taskList}`);
      } else {
        speak('You have no pending tasks. Great job staying on top of everything!');
      }
      return;
    }

    // Show overdue tasks
    if (command.includes('overdue') || command.includes('late tasks')) {
      const overdueTasks = tasks.filter(t => !t.completed && t.dueDate < new Date());
      if (overdueTasks.length > 0) {
        const overdueList = overdueTasks.map(t => t.title).join(', ');
        speak(`You have ${overdueTasks.length} overdue tasks: ${overdueList}. Let's prioritize these!`);
      } else {
        speak('You have no overdue tasks. Excellent work!');
      }
      return;
    }

    // Show today's tasks
    if (command.includes('today') || command.includes('today\'s tasks')) {
      const today = new Date();
      const todayTasks = tasks.filter(t => {
        const taskDate = new Date(t.dueDate);
        return taskDate.toDateString() === today.toDateString() && !t.completed;
      });
      
      if (todayTasks.length > 0) {
        const todayList = todayTasks.map(t => t.title).join(', ');
        speak(`You have ${todayTasks.length} tasks due today: ${todayList}`);
      } else {
        speak('You have no tasks due today. Perfect time to get ahead!');
      }
      return;
    }

    // Progress report
    if (command.includes('progress') || command.includes('how am I doing')) {
      const completed = tasks.filter(t => t.completed).length;
      const total = tasks.length;
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
      speak(`You've completed ${completed} out of ${total} tasks, that's ${percentage} percent. ${percentage >= 75 ? 'Outstanding progress!' : percentage >= 50 ? 'Good work, keep it up!' : 'You can do this, one task at a time!'}`);
      return;
    }

    // Default response
    speak('I didn\'t understand that command. Try saying "add task", "list tasks", "complete task", or "show progress".');
    toast.info('Command not recognized. Try: "add task", "list tasks", "complete task", or "show progress"');
  };

  const toggleListening = () => {
    if (!recognition || !isSupported) {
      toast.error('Voice commands not supported in this browser');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
      toast.info('Listening for voice commands...');
    }
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card className="p-4 backdrop-blur-sm bg-white/90 border-0 shadow-lg">
        <div className="flex items-center gap-3">
          <Button
            onClick={toggleListening}
            size="sm"
            className={`${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <div className="text-sm">
            <div className="font-medium">Voice Commands</div>
            <div className="text-xs text-gray-600">
              {isListening ? 'Listening...' : 'Click to activate'}
            </div>
          </div>
          <Volume2 className="h-4 w-4 text-gray-400" />
        </div>
        
        {isListening && (
          <div className="mt-2 text-xs text-gray-600">
            Try: "Add task meeting", "List tasks", "Complete task review"
          </div>
        )}
      </Card>
    </div>
  );
};

export default VoiceCommands;
