import type { Commission } from '../../types';
import { getDateOffset } from './constants';

export const commissions: Commission[] = [
  { id: 'COM-001', type: 'BROKER', dealId: 'DEL-001', brokerId: 'BRK-001', amount: 25000, status: 'PAID', dueDate: getDateOffset(-15), paidDate: getDateOffset(-14) },
  { id: 'COM-002', type: 'FINANCE', dealId: 'DEL-001', loanId: 'LON-001', amount: 40000, rate: 2.0, status: 'PAID', dueDate: getDateOffset(-10), paidDate: getDateOffset(-5) },
  { id: 'COM-003', type: 'BROKER', dealId: 'DEL-002', brokerId: 'BRK-004', amount: 20000, status: 'PENDING', dueDate: getDateOffset(5) },
  { id: 'COM-004', type: 'FINANCE', dealId: 'DEL-002', loanId: 'LON-002', amount: 27000, rate: 1.5, status: 'PENDING', dueDate: getDateOffset(15) },
  { id: 'COM-005', type: 'BROKER', dealId: 'DEL-003', brokerId: 'BRK-002', amount: 30000, status: 'PARTIAL', dueDate: getDateOffset(-20), paidDate: getDateOffset(-10), notes: 'Paid 15000, remaining 15000' },
  { id: 'COM-006', type: 'FINANCE', dealId: 'DEL-004', loanId: 'LON-003', amount: 20000, rate: 2.0, status: 'PENDING', dueDate: getDateOffset(5) }
];
