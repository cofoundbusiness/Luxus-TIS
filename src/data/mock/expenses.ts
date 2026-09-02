import type { Expense } from '../../types';
import { getDateOffset } from './constants';

export const expenses: Expense[] = [
  { id: 'EXP-001', truckId: 'TRK-003', category: 'PREPARATION', description: 'Cleaning and polishing', amount: 5000, date: getDateOffset(-55) },
  { id: 'EXP-002', truckId: 'TRK-003', category: 'SERVICE', description: 'Oil change and filters', amount: 12000, date: getDateOffset(-50) },
  { id: 'EXP-003', truckId: 'TRK-005', category: 'REPAIR', description: 'Engine overhaul partial', amount: 85000, date: getDateOffset(-15) }, // High expense
  { id: 'EXP-004', truckId: 'TRK-005', category: 'REPAIR', description: 'Gearbox synchro ring replacement', amount: 45000, date: getDateOffset(-12) }, // High expense
  { id: 'EXP-005', truckId: 'TRK-001', category: 'TRANSPORT', description: 'Driver allowance for yard transfer', amount: 2500, date: getDateOffset(-98) },
  { id: 'EXP-006', truckId: 'TRK-004', category: 'PREPARATION', description: 'Paint touch-up', amount: 15000, date: getDateOffset(-30) },
  { id: 'EXP-007', truckId: 'TRK-006', category: 'OTHER', description: 'RTO documentation charge', amount: 8000, date: getDateOffset(-110) },
  { id: 'EXP-008', dealId: 'DEL-001', category: 'OTHER', description: 'Deal closing celebration/sweets', amount: 1500, date: getDateOffset(-19) },
  { id: 'EXP-009', truckId: 'TRK-010', category: 'TRANSPORT', description: 'Recovery towing', amount: 12000, date: getDateOffset(-145) },
  { id: 'EXP-010', truckId: 'TRK-009', category: 'SERVICE', description: 'General checkup', amount: 4000, date: getDateOffset(-75) }
];
