import type { User, UserRole } from '../types';
import { mockUsers } from './mock-users';

const SESSION_KEY = 'luxus-tis-auth-session';

export interface Session {
  user: User;
  token: string; // Mock token
  expiresAt: string;
}

class AuthService {
  private getMockUserByEmail(email: string): User | undefined {
    return mockUsers.find(u => u.email === email);
  }

  private getMockUserByRole(role: UserRole): User | undefined {
    return mockUsers.find(u => u.role === role);
  }

  async login(email: string, _password?: string): Promise<Session> {
    // Mock network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = this.getMockUserByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password.');
    }
    if (user.status !== 'ACTIVE') {
      throw new Error('Account is inactive.');
    }

    const session: Session = {
      user,
      token: `mock-jwt-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  async devAccessLogin(role: UserRole): Promise<Session> {
    const user = this.getMockUserByRole(role);
    if (!user) throw new Error(`No mock user found for role ${role}`);
    
    const session: Session = {
      user,
      token: `mock-jwt-dev-${Date.now()}`,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };

    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
  }

  getSession(): Session | null {
    const stored = localStorage.getItem(SESSION_KEY);
    if (!stored) return null;
    try {
      const session = JSON.parse(stored) as Session;
      if (new Date(session.expiresAt) < new Date()) {
        this.logout();
        return null;
      }
      return session;
    } catch (e) {
      this.logout();
      return null;
    }
  }

  getCurrentUser(): User | null {
    return this.getSession()?.user || null;
  }

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}

export const authService = new AuthService();
