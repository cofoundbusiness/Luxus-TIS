import type { FinancePartner, Broker, Customer } from '../../types';
import { getDateOffset } from './constants';

export const financePartners: FinancePartner[] = [
  { id: 'FIN-001', name: 'Chola Finance', contactPerson: 'Ramesh K', phone: '9876543210', email: 'ramesh@chola.mock', commissionRate: 2.0, status: 'ACTIVE' },
  { id: 'FIN-002', name: 'Shriram Transport Finance', contactPerson: 'Murugan P', phone: '9876543211', email: 'murugan@stfc.mock', commissionRate: 1.5, status: 'ACTIVE' },
  { id: 'FIN-003', name: 'HDFC Bank CV', contactPerson: 'Suresh V', phone: '9876543212', commissionRate: 1.0, status: 'INACTIVE', notes: 'Temporarily halted operations' },
];

export const brokers: Broker[] = [
  { id: 'BRK-001', name: 'Mani', companyName: 'Mani Transports & Brokers', phone: '9988776655', city: 'Salem', status: 'ACTIVE', createdAt: getDateOffset(-200), updatedAt: getDateOffset(-10) },
  { id: 'BRK-002', name: 'Rajendran', phone: '9988776656', city: 'Namakkal', status: 'ACTIVE', createdAt: getDateOffset(-150), updatedAt: getDateOffset(-5) },
  { id: 'BRK-003', name: 'Karthik', phone: '9988776657', city: 'Coimbatore', status: 'INACTIVE', createdAt: getDateOffset(-300), updatedAt: getDateOffset(-100), notes: 'Inactive since last year' },
  { id: 'BRK-004', name: 'Velu', companyName: 'Vel Murugan Auto', phone: '9988776658', city: 'Erode', status: 'ACTIVE', createdAt: getDateOffset(-60), updatedAt: getDateOffset(-2) },
  { id: 'BRK-005', name: 'Saravanan', phone: '9988776659', city: 'Chennai', status: 'ACTIVE', createdAt: getDateOffset(-30), updatedAt: getDateOffset(-30) },
  { id: 'BRK-006', name: 'Ashok', phone: '9988776660', city: 'Madurai', status: 'ACTIVE', createdAt: getDateOffset(-10), updatedAt: getDateOffset(-10) },
];

export const customers: Customer[] = [
  { id: 'CUS-001', name: 'Senthil Kumar', phone: '9001122334', city: 'Salem', createdAt: getDateOffset(-180), updatedAt: getDateOffset(-10) },
  { id: 'CUS-002', name: 'Prakash', companyName: 'Prakash Logistics', phone: '9001122335', city: 'Coimbatore', createdAt: getDateOffset(-120), updatedAt: getDateOffset(-5) },
  { id: 'CUS-003', name: 'Balaji', phone: '9001122336', city: 'Chennai', createdAt: getDateOffset(-90), updatedAt: getDateOffset(-20) },
  { id: 'CUS-004', name: 'Sri Ram Transport', companyName: 'Sri Ram Transport', phone: '9001122337', city: 'Tiruppur', createdAt: getDateOffset(-60), updatedAt: getDateOffset(-15) },
  { id: 'CUS-005', name: 'Arun', phone: '9001122338', city: 'Madurai', createdAt: getDateOffset(-45), updatedAt: getDateOffset(-2) },
  { id: 'CUS-006', name: 'Ganesh', phone: '9001122339', city: 'Erode', createdAt: getDateOffset(-30), updatedAt: getDateOffset(-30) },
  { id: 'CUS-007', name: 'KVK Freight', companyName: 'KVK Freight', phone: '9001122340', city: 'Trichy', createdAt: getDateOffset(-15), updatedAt: getDateOffset(-15) },
  { id: 'CUS-008', name: 'Muthu', phone: '9001122341', city: 'Hosur', createdAt: getDateOffset(-5), updatedAt: getDateOffset(-5) },
];
