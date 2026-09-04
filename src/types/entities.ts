import type { ID, ISODateString, Currency, Percentage } from './common';
import type {
  TruckStatus,
  LeadStatus,
  BrokerStatus,
  DealStatus,
  LoanStatus,
  FinancePartnerStatus,
  CommissionType,
  CommissionStatus,
  ExpenseCategory,
  DocumentStatus,
  EntityType
} from './enums';

export interface TruckPhoto {
  id: string;
  url: string;
  isPrimary: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface Truck {
  id: ID;
  registrationNumber: string;
  chassisNumber: string;
  manufacturer: string;
  model: string;
  variant: string;
  year: number;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  purchasePrice: Currency;
  sellingPrice: Currency;
  expectedProfit: Currency;
  location: string;
  status: TruckStatus;
  purchaseDate: ISODateString;
  createdAt: ISODateString;
  updatedAt: ISODateString;
  photos?: TruckPhoto[];
}

export interface Customer {
  id: ID;
  name: string;
  phone: string;
  email?: string;
  companyName?: string;
  address?: string;
  city?: string;
  state?: string;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Lead {
  id: ID;
  customerId: ID;
  truckId?: ID;
  brokerId?: ID;
  source: string;
  requirement: string;
  budget: Currency;
  status: LeadStatus;
  probability: Percentage;
  nextFollowUp?: ISODateString;
  notes?: string;
  assignedTo?: ID;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Broker {
  id: ID;
  name: string;
  companyName?: string;
  phone: string;
  email?: string;
  city?: string;
  notes?: string;
  status: BrokerStatus;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Deal {
  id: ID;
  truckId: ID;
  customerId: ID;
  brokerId?: ID;
  salePrice: Currency;
  saleDate: ISODateString;
  status: DealStatus;
  notes?: string;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface Loan {
  id: ID;
  dealId: ID;
  customerId: ID;
  truckId: ID;
  financePartnerId: ID;
  loanAmount: Currency;
  commissionRate: Percentage;
  expectedCommission: Currency;
  receivedCommission: Currency;
  status: LoanStatus;
  applicationDate: ISODateString;
  approvalDate?: ISODateString;
  receivedDate?: ISODateString;
  notes?: string;
}

export interface FinancePartner {
  id: ID;
  name: string;
  contactPerson?: string;
  phone?: string;
  email?: string;
  commissionRate: Percentage;
  status: FinancePartnerStatus;
  notes?: string;
}

export interface Commission {
  id: ID;
  type: CommissionType;
  dealId: ID;
  brokerId?: ID;
  loanId?: ID;
  amount: Currency;
  rate?: Percentage;
  status: CommissionStatus;
  dueDate?: ISODateString;
  paidDate?: ISODateString;
  notes?: string;
}

export interface Expense {
  id: ID;
  truckId?: ID;
  dealId?: ID;
  category: ExpenseCategory;
  description: string;
  amount: Currency;
  date: ISODateString;
  notes?: string;
}

export interface Document {
  id: ID;
  entityType: EntityType;
  entityId: ID;
  documentType: string;
  name: string;
  fileUrl: string;
  status: DocumentStatus;
  uploadedAt: ISODateString;
}

export interface Activity {
  id: ID;
  entityType: EntityType;
  entityId: ID;
  action: string;
  description: string;
  performedBy: ID;
  timestamp: ISODateString;
}
