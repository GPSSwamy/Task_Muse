
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, CheckSquare, Calendar, MessageCircle, TrendingUp, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from '@/components/AuthContext';
import AuthModal from '@/components/AuthModal';

interface NavigationProps {
  activeView: string;
  setActiveView: (view: string) => void;
}

const Navigation = ({ activeView, setActiveView }: NavigationProps) => {
  const { user, login, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'chat', label: 'AI Assistant', icon: MessageCircle }
  ];

  return (
    <>
      <Card className="p-4 backdrop-blur-sm bg-white/70 border-0 shadow-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            TaskMuse AI
          </h1>
          <p className="text-sm text-gray-600 mt-1">Your Intelligent Assistant</p>
        </div>

        {/* User Section */}
        <div className="mb-6 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User size={16} className="text-blue-600" />
                <span className="text-sm font-medium text-gray-700 truncate">
                  {user?.name}
                </span>
              </div>
              <Button
                onClick={logout}
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-xs hover:bg-white/50"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </div>
          ) : (
            <Button
              onClick={() => setShowAuthModal(true)}
              variant="ghost"
              className="w-full justify-start gap-2 hover:bg-white/50"
            >
              <LogIn size={16} />
              Sign In
            </Button>
          )}
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                    : 'hover:bg-white/50 text-gray-700 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp size={16} className="text-blue-600" />
            <span className="text-sm font-medium text-gray-700">Today's Progress</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4"></div>
          </div>
          <p className="text-xs text-gray-600 mt-1">75% Complete</p>
        </div>
      </Card>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuth={login}
      />
    </>
  );
};

export default Navigation;
