import type { User } from '../types';

export const mockUsers: User[] = [
  {
    id: 'USR-001',
    name: 'Administrator',
    email: 'admin@luxustis.local',
    role: 'ADMINISTRATOR',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-002',
    name: 'Manager',
    email: 'manager@luxustis.local',
    role: 'MANAGER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-003',
    name: 'Sales Rep',
    email: 'sales@luxustis.local',
    role: 'SALES',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-004',
    name: 'Operations Staff',
    email: 'operations@luxustis.local',
    role: 'OPERATIONS',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-005',
    name: 'Finance Officer',
    email: 'finance@luxustis.local',
    role: 'FINANCE',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: 'USR-006',
    name: 'Viewer',
    email: 'viewer@luxustis.local',
    role: 'VIEWER',
    status: 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];
