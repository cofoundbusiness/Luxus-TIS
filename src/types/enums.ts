export const TruckStatus = {
  AVAILABLE: 'AVAILABLE',
  RESERVED: 'RESERVED',
  SOLD: 'SOLD',
  PENDING_DOCUMENTS: 'PENDING_DOCUMENTS',
  UNDER_PREPARATION: 'UNDER_PREPARATION'
} as const;
export type TruckStatus = typeof TruckStatus[keyof typeof TruckStatus];

export const LeadStatus = {
  NEW: 'NEW',
  CONTACTED: 'CONTACTED',
  INTERESTED: 'INTERESTED',
  NEGOTIATION: 'NEGOTIATION',
  BOOKED: 'BOOKED',
  SOLD: 'SOLD',
  LOST: 'LOST'
} as const;
export type LeadStatus = typeof LeadStatus[keyof typeof LeadStatus];

export const BrokerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;
export type BrokerStatus = typeof BrokerStatus[keyof typeof BrokerStatus];

export const DealStatus = {
  NEGOTIATION: 'NEGOTIATION',
  BOOKED: 'BOOKED',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
} as const;
export type DealStatus = typeof DealStatus[keyof typeof DealStatus];

export const LoanStatus = {
  APPLICATION: 'APPLICATION',
  PROCESSING: 'PROCESSING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
  DISBURSED: 'DISBURSED'
} as const;
export type LoanStatus = typeof LoanStatus[keyof typeof LoanStatus];

export const FinancePartnerStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;
export type FinancePartnerStatus = typeof FinancePartnerStatus[keyof typeof FinancePartnerStatus];

export const CommissionType = {
  BROKER: 'BROKER',
  FINANCE: 'FINANCE'
} as const;
export type CommissionType = typeof CommissionType[keyof typeof CommissionType];

export const CommissionStatus = {
  PENDING: 'PENDING',
  PARTIAL: 'PARTIAL',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED'
} as const;
export type CommissionStatus = typeof CommissionStatus[keyof typeof CommissionStatus];

export const ExpenseCategory = {
  REPAIR: 'REPAIR',
  SERVICE: 'SERVICE',
  TRANSPORT: 'TRANSPORT',
  PREPARATION: 'PREPARATION',
  OTHER: 'OTHER'
} as const;
export type ExpenseCategory = typeof ExpenseCategory[keyof typeof ExpenseCategory];

export const DocumentStatus = {
  PENDING: 'PENDING',
  AVAILABLE: 'AVAILABLE',
  EXPIRED: 'EXPIRED'
} as const;
export type DocumentStatus = typeof DocumentStatus[keyof typeof DocumentStatus];

export const EntityType = {
  TRUCK: 'TRUCK',
  CUSTOMER: 'CUSTOMER',
  LEAD: 'LEAD',
  BROKER: 'BROKER',
  DEAL: 'DEAL',
  LOAN: 'LOAN',
  FINANCE_PARTNER: 'FINANCE_PARTNER',
  COMMISSION: 'COMMISSION',
  EXPENSE: 'EXPENSE'
} as const;
export type EntityType = typeof EntityType[keyof typeof EntityType];

export const UserRole = {
  ADMINISTRATOR: 'ADMINISTRATOR',
  MANAGER: 'MANAGER',
  SALES: 'SALES',
  OPERATIONS: 'OPERATIONS',
  FINANCE: 'FINANCE',
  VIEWER: 'VIEWER'
} as const;
export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserStatus = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE'
} as const;
export type UserStatus = typeof UserStatus[keyof typeof UserStatus];



