import type { Loan } from '../../types';
import { getDateOffset } from './constants';

export const loans: Loan[] = [
  { id: 'LON-001', dealId: 'DEL-001', customerId: 'CUS-001', truckId: 'TRK-003', financePartnerId: 'FIN-001', loanAmount: 2000000, commissionRate: 2.0, expectedCommission: 40000, receivedCommission: 40000, status: 'DISBURSED', applicationDate: getDateOffset(-24), approvalDate: getDateOffset(-21), receivedDate: getDateOffset(-15) },
  { id: 'LON-002', dealId: 'DEL-002', customerId: 'CUS-002', truckId: 'TRK-004', financePartnerId: 'FIN-002', loanAmount: 1800000, commissionRate: 1.5, expectedCommission: 27000, receivedCommission: 0, status: 'PROCESSING', applicationDate: getDateOffset(-5) },
  { id: 'LON-003', dealId: 'DEL-004', customerId: 'CUS-007', truckId: 'TRK-009', financePartnerId: 'FIN-001', loanAmount: 1000000, commissionRate: 2.0, expectedCommission: 20000, receivedCommission: 0, status: 'APPROVED', applicationDate: getDateOffset(-28), approvalDate: getDateOffset(-26) },
  { id: 'LON-004', dealId: 'DEL-005', customerId: 'CUS-008', truckId: 'TRK-010', financePartnerId: 'FIN-003', loanAmount: 900000, commissionRate: 1.0, expectedCommission: 9000, receivedCommission: 0, status: 'REJECTED', applicationDate: getDateOffset(-98), notes: 'Customer credit score insufficient' }
];
