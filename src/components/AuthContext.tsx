
import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (credentials: { email: string; password: string; name?: string }) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = (credentials: { email: string; password: string; name?: string }) => {
    // In a real app, this would make an API call
    console.log('Login attempt:', credentials);
    const newUser: User = {
      id: Date.now().toString(),
      name: credentials.name || credentials.email.split('@')[0],
      email: credentials.email
    };
    setUser(newUser);
    localStorage.setItem('taskMuse_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskMuse_user');
  };

  // Check for existing user on component mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('taskMuse_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};
