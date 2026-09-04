import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, UserRole } from '../types';
import { authService, type Session } from './auth-service';
import { hasPermission, type Permission } from './permissions';

interface AuthContextType {
  currentUser: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  devAccessLogin: (role: UserRole) => Promise<void>;
  logout: () => void;
  can: (permission: Permission) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restore session on mount
    const restoreSession = async () => {
      try {
        const storedSession = authService.getSession();
        if (storedSession) {
          setSession(storedSession);
          setCurrentUser(storedSession.user);
        }
      } catch (err) {
        console.error("Session restoration failed:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    restoreSession();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const newSession = await authService.login(email, password);
      setSession(newSession);
      setCurrentUser(newSession.user);
    } finally {
      setIsLoading(false);
    }
  };

  const devAccessLogin = async (role: UserRole) => {
    setIsLoading(true);
    try {
      const newSession = await authService.devAccessLogin(role);
      setSession(newSession);
      setCurrentUser(newSession.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setSession(null);
    setCurrentUser(null);
  };

  const can = (permission: Permission) => {
    return hasPermission(currentUser?.role, permission);
  };

  const value = {
    currentUser,
    session,
    isAuthenticated: !!currentUser,
    isLoading,
    login,
    devAccessLogin,
    logout,
    can
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
