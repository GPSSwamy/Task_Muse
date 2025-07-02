
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Send, Bot, User, Lightbulb, Target, TrendingUp } from 'lucide-react';

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

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  suggestions?: string[];
}

interface AIChatProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

const AIChat = ({ tasks, setTasks }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. I'm here to help you stay productive and motivated. How can I assist you today?",
      sender: 'ai',
      timestamp: new Date(),
      suggestions: ['Show my overdue tasks', 'Suggest task priorities', 'Give me motivation']
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    const overdueTasks = tasks.filter(task => !task.completed && task.dueDate < new Date());
    const highPriorityTasks = tasks.filter(task => !task.completed && task.priority === 'high');
    const completedTasks = tasks.filter(task => task.completed);

    if (lowerMessage.includes('overdue')) {
      if (overdueTasks.length > 0) {
        return `You have ${overdueTasks.length} overdue tasks. Let's prioritize: ${overdueTasks.map(t => t.title).join(', ')}. I recommend tackling the highest priority ones first!`;
      }
      return "Great news! You don't have any overdue tasks. You're staying on top of things! 🎉";
    }

    if (lowerMessage.includes('priority') || lowerMessage.includes('priorit')) {
      if (highPriorityTasks.length > 0) {
        return `Your high-priority tasks are: ${highPriorityTasks.map(t => t.title).join(', ')}. I suggest focusing on these first to make the biggest impact!`;
      }
      return "You don't have any high-priority tasks right now. Consider reviewing your task list and identifying what needs urgent attention.";
    }

    if (lowerMessage.includes('motivation') || lowerMessage.includes('motivat')) {
      const motivationalMessages = [
        `You've completed ${completedTasks.length} tasks so far - that's amazing progress! 💪`,
        "Remember: progress, not perfection. Every small step counts toward your goals! 🌟",
        "You're capable of incredible things. Break down big tasks into smaller, manageable steps! 🚀",
        "Success is the sum of small efforts repeated day in and day out. Keep going! ✨"
      ];
      return motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)];
    }

    if (lowerMessage.includes('progress') || lowerMessage.includes('how am i doing')) {
      const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;
      return `You're doing great! You've completed ${completionRate}% of your tasks (${completedTasks.length}/${tasks.length}). ${completionRate >= 75 ? 'Excellent work!' : completionRate >= 50 ? 'Good progress, keep it up!' : 'You can do this - one task at a time!'} 📈`;
    }

    if (lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      return "Based on your task patterns, I recommend: 1) Schedule your high-priority tasks during your most productive hours, 2) Break large tasks into smaller, actionable steps, 3) Set up recurring tasks for regular activities. What would you like help with specifically?";
    }

    if (lowerMessage.includes('help')) {
      return "I can help you with: 📋 Task prioritization, ⏰ Deadline reminders, 📈 Progress tracking, 💡 Productivity tips, 🎯 Goal setting. What would you like to explore?";
    }

    // Default responses
    const defaultResponses = [
      "I'm here to help you stay organized and productive! What specific assistance do you need with your tasks?",
      "Let me help you manage your workload better. Would you like me to analyze your current tasks or provide some productivity tips?",
      "Great question! I can provide insights about your tasks, remind you of deadlines, or offer motivation. What would be most helpful right now?",
      "I'm analyzing your task patterns to provide better assistance. In the meantime, is there anything specific you'd like help with?"
    ];
    
    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        text: generateAIResponse(inputValue),
        sender: 'ai',
        timestamp: new Date(),
        suggestions: ['Tell me more', 'Show task summary', 'Give me tips']
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-[600px] flex flex-col backdrop-blur-sm bg-white/70 border-0 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-white/20 text-white">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs text-blue-100">Your productivity companion</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start gap-2 ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className={message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-purple-500 text-white'}>
                    {message.sender === 'user' ? <User className="h-3 w-3" /> : <Bot className="h-3 w-3" />}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              {message.suggestions && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {message.suggestions.map((suggestion, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="cursor-pointer hover:bg-blue-50 text-xs"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      {suggestion}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarFallback className="bg-purple-500 text-white">
                  <Bot className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-100 p-3 rounded-lg">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your tasks..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} disabled={!inputValue.trim()} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AIChat;
