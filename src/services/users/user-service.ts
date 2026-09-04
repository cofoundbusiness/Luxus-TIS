import type { User } from '../../types';
import { mockUsers } from '../../auth/mock-users';

export function getAllUsers(): User[] {
  return [...mockUsers];
}

export function getUserById(id: string): User | undefined {
  return mockUsers.find(u => u.id === id);
}

export function createUser(userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const newUser: User = {
    ...userData,
    id: `USR-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  mockUsers.push(newUser);
  return newUser;
}

export function updateUser(id: string, updates: Partial<User>): User | null {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) return null;

  const updatedUser = {
    ...mockUsers[index],
    ...updates,
    updatedAt: new Date().toISOString()
  };
  mockUsers[index] = updatedUser;
  return updatedUser;
}

export function deactivateUser(id: string): boolean {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) return false;
  
  mockUsers[index].status = 'INACTIVE';
  mockUsers[index].updatedAt = new Date().toISOString();
  return true;
}

export function activateUser(id: string): boolean {
  const index = mockUsers.findIndex(u => u.id === id);
  if (index === -1) return false;
  
  mockUsers[index].status = 'ACTIVE';
  mockUsers[index].updatedAt = new Date().toISOString();
  return true;
}
