import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../firebase';
import { signInAnonymously, User } from 'firebase/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
    });

    return unsubscribe;
  }, []);

  const login = async (username: string, password: string) => {
    // For simplicity, we're using anonymous auth
    // In a real app, you'd want to implement proper authentication
    await signInAnonymously(auth);
  };

  const logout = () => auth.signOut();

  const value = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};