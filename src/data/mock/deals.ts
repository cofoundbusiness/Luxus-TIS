import type { Deal } from '../../types';
import { getDateOffset } from './constants';

export const deals: Deal[] = [
  // 1: Completed deal with broker and loan
  { id: 'DEL-001', truckId: 'TRK-003', customerId: 'CUS-001', brokerId: 'BRK-001', salePrice: 2600000, saleDate: getDateOffset(-20), status: 'COMPLETED', createdAt: getDateOffset(-25), updatedAt: getDateOffset(-15) },
  // 2: Booked deal, loan processing
  { id: 'DEL-002', truckId: 'TRK-004', customerId: 'CUS-002', brokerId: 'BRK-004', salePrice: 2150000, saleDate: getDateOffset(-5), status: 'BOOKED', createdAt: getDateOffset(-7), updatedAt: getDateOffset(-5) },
  // 3: Completed deal with broker, no loan (cash)
  { id: 'DEL-003', truckId: 'TRK-006', customerId: 'CUS-004', brokerId: 'BRK-002', salePrice: 1200000, saleDate: getDateOffset(-40), status: 'COMPLETED', createdAt: getDateOffset(-45), updatedAt: getDateOffset(-30) },
  // 4: Completed deal direct (no broker) with loan
  { id: 'DEL-004', truckId: 'TRK-009', customerId: 'CUS-007', salePrice: 1500000, saleDate: getDateOffset(-25), status: 'COMPLETED', createdAt: getDateOffset(-30), updatedAt: getDateOffset(-20) },
  // 5: Cancelled deal
  { id: 'DEL-005', truckId: 'TRK-010', customerId: 'CUS-008', brokerId: 'BRK-005', salePrice: 1250000, saleDate: getDateOffset(-95), status: 'CANCELLED', notes: 'Loan rejected', createdAt: getDateOffset(-100), updatedAt: getDateOffset(-90) },
];
