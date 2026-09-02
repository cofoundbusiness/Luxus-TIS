import type { Lead } from '../../types';
import { getDateOffset } from './constants';

export const leads: Lead[] = [
  // 1: Sold (Matches D-001)
  { id: 'LED-001', customerId: 'CUS-001', truckId: 'TRK-003', brokerId: 'BRK-001', source: 'Broker', requirement: '28-tonner for cement transport', budget: 2500000, status: 'SOLD', probability: 100, createdAt: getDateOffset(-40), updatedAt: getDateOffset(-20) },
  // 2: Booked (Matches D-002)
  { id: 'LED-002', customerId: 'CUS-002', truckId: 'TRK-004', brokerId: 'BRK-004', source: 'Broker', requirement: '10-wheeler', budget: 2200000, status: 'BOOKED', probability: 95, createdAt: getDateOffset(-15), updatedAt: getDateOffset(-5) },
  // 3: Negotiation (Direct)
  { id: 'LED-003', customerId: 'CUS-003', truckId: 'TRK-001', source: 'Direct Walk-in', requirement: '49-tonner tractor', budget: 1700000, status: 'NEGOTIATION', probability: 80, nextFollowUp: getDateOffset(1), notes: 'Customer arranging down payment', createdAt: getDateOffset(-10), updatedAt: getDateOffset(-2) },
  // 4: Overdue Follow-up
  { id: 'LED-004', customerId: 'CUS-005', truckId: 'TRK-007', source: 'Website', requirement: 'High margin heavy duty', budget: 2800000, status: 'INTERESTED', probability: 40, nextFollowUp: getDateOffset(-3), notes: 'Call him regarding loan options', createdAt: getDateOffset(-10), updatedAt: getDateOffset(-5) },
  // 5: Lost
  { id: 'LED-005', customerId: 'CUS-008', truckId: 'TRK-010', brokerId: 'BRK-005', source: 'Broker', requirement: 'LCV', budget: 1300000, status: 'LOST', probability: 0, notes: 'Loan rejected, customer bought elsewhere', createdAt: getDateOffset(-120), updatedAt: getDateOffset(-95) },
  // 6: New
  { id: 'LED-006', customerId: 'CUS-006', source: 'Reference', requirement: 'Looking for a reliable tipper', budget: 1500000, status: 'NEW', probability: 20, nextFollowUp: getDateOffset(0), createdAt: getDateOffset(0), updatedAt: getDateOffset(0) },
  // 7: Contacted
  { id: 'LED-007', customerId: 'CUS-003', truckId: 'TRK-008', brokerId: 'BRK-001', source: 'Broker', requirement: 'Budget LCV', budget: 450000, status: 'CONTACTED', probability: 30, nextFollowUp: getDateOffset(2), createdAt: getDateOffset(-2), updatedAt: getDateOffset(-1) },
  // 8: Sold (Matches D-003)
  { id: 'LED-008', customerId: 'CUS-004', truckId: 'TRK-006', brokerId: 'BRK-002', source: 'Broker', requirement: 'Cowl chassis for custom body', budget: 1200000, status: 'SOLD', probability: 100, createdAt: getDateOffset(-50), updatedAt: getDateOffset(-40) },
  // 9: Sold (Matches D-004)
  { id: 'LED-009', customerId: 'CUS-007', truckId: 'TRK-009', source: 'Direct Walk-in', requirement: 'Cabin chassis, reliable model', budget: 1600000, status: 'SOLD', probability: 100, createdAt: getDateOffset(-35), updatedAt: getDateOffset(-25) },
  // 10: Negotiation
  { id: 'LED-010', customerId: 'CUS-005', truckId: 'TRK-011', source: 'Website', requirement: 'Newest model 1923', budget: 3100000, status: 'NEGOTIATION', probability: 60, nextFollowUp: getDateOffset(1), createdAt: getDateOffset(-2), updatedAt: getDateOffset(-1) },
  // 11: Interested
  { id: 'LED-011', customerId: 'CUS-006', truckId: 'TRK-012', source: 'Reference', requirement: 'Tractor trailer combo', budget: 1600000, status: 'INTERESTED', probability: 50, nextFollowUp: getDateOffset(4), createdAt: getDateOffset(-1), updatedAt: getDateOffset(-1) },
  // 12: New
  { id: 'LED-012', customerId: 'CUS-002', source: 'Direct Walk-in', requirement: 'Another 10-wheeler', budget: 2000000, status: 'NEW', probability: 20, nextFollowUp: getDateOffset(1), createdAt: getDateOffset(0), updatedAt: getDateOffset(0) },
];
