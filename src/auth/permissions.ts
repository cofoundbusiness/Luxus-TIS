import { UserRole } from '../types';

export type Permission = 
  | 'inventory.view' | 'inventory.create' | 'inventory.edit' | 'inventory.delete'
  | 'customers.view' | 'customers.create' | 'customers.edit' | 'customers.delete'
  | 'leads.view' | 'leads.create' | 'leads.edit' | 'leads.delete'
  | 'brokers.view' | 'brokers.create' | 'brokers.edit' | 'brokers.delete'
  | 'deals.view' | 'deals.create' | 'deals.edit' | 'deals.delete'
  | 'loans.view' | 'loans.create' | 'loans.edit' | 'loans.delete'
  | 'commissions.view' | 'commissions.create' | 'commissions.edit' | 'commissions.delete'
  | 'expenses.view' | 'expenses.create' | 'expenses.edit' | 'expenses.delete'
  | 'documents.view' | 'documents.create' | 'documents.edit' | 'documents.delete'
  | 'reports.view'
  | 'insights.view'
  | 'users.view' | 'users.create' | 'users.edit' | 'users.delete'
  | 'settings.view' | 'settings.edit'
  | 'finance_partners.view' | 'finance_partners.create' | 'finance_partners.edit' | 'finance_partners.delete';

export const RolePermissions: Record<UserRole, Permission[]> = {
  ADMINISTRATOR: [
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
    'brokers.view', 'brokers.create', 'brokers.edit', 'brokers.delete',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'loans.view', 'loans.create', 'loans.edit', 'loans.delete',
    'commissions.view', 'commissions.create', 'commissions.edit', 'commissions.delete',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
    'documents.view', 'documents.create', 'documents.edit', 'documents.delete',
    'finance_partners.view', 'finance_partners.create', 'finance_partners.edit', 'finance_partners.delete',
    'reports.view', 'insights.view',
    'users.view', 'users.create', 'users.edit', 'users.delete',
    'settings.view', 'settings.edit'
  ],
  MANAGER: [
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
    'customers.view', 'customers.create', 'customers.edit', 'customers.delete',
    'leads.view', 'leads.create', 'leads.edit', 'leads.delete',
    'brokers.view', 'brokers.create', 'brokers.edit', 'brokers.delete',
    'deals.view', 'deals.create', 'deals.edit', 'deals.delete',
    'loans.view', 'loans.create', 'loans.edit', 'loans.delete',
    'commissions.view', 'commissions.create', 'commissions.edit', 'commissions.delete',
    'expenses.view', 'expenses.create', 'expenses.edit', 'expenses.delete',
    'documents.view', 'documents.create', 'documents.edit', 'documents.delete',
    'finance_partners.view', 'finance_partners.create', 'finance_partners.edit', 'finance_partners.delete',
    'reports.view', 'insights.view',
    'users.view',
    'settings.view'
  ],
  SALES: [
    'inventory.view',
    'customers.view', 'customers.create', 'customers.edit',
    'leads.view', 'leads.create', 'leads.edit',
    'brokers.view', 'brokers.create', 'brokers.edit',
    'deals.view', 'deals.create', 'deals.edit',
    'reports.view', 'insights.view'
  ],
  OPERATIONS: [
    'inventory.view', 'inventory.create', 'inventory.edit',
    'customers.view',
    'documents.view', 'documents.create', 'documents.edit',
    'expenses.view', 'expenses.create', 'expenses.edit',
    'reports.view', 'insights.view'
  ],
  FINANCE: [
    'deals.view',
    'loans.view', 'loans.create', 'loans.edit',
    'finance_partners.view', 'finance_partners.create', 'finance_partners.edit',
    'commissions.view', 'commissions.create', 'commissions.edit',
    'expenses.view', 'expenses.create', 'expenses.edit',
    'reports.view', 'insights.view'
  ],
  VIEWER: [
    'inventory.view',
    'customers.view',
    'leads.view',
    'brokers.view',
    'deals.view',
    'loans.view',
    'commissions.view',
    'expenses.view',
    'documents.view',
    'finance_partners.view',
    'reports.view',
    'insights.view'
  ]
};

export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  return RolePermissions[role]?.includes(permission) ?? false;
}
