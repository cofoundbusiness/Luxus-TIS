import type { Activity } from '../../types';
import { getDateOffset } from './constants';

export const activities: Activity[] = [
  { id: 'ACT-001', entityType: 'TRUCK', entityId: 'TRK-001', action: 'ADDED_TO_INVENTORY', description: 'Truck added to inventory', performedBy: 'SYS-ADMIN', timestamp: getDateOffset(-100) },
  { id: 'ACT-002', entityType: 'TRUCK', entityId: 'TRK-003', action: 'ADDED_TO_INVENTORY', description: 'Truck added to inventory', performedBy: 'SYS-ADMIN', timestamp: getDateOffset(-60) },
  { id: 'ACT-003', entityType: 'LEAD', entityId: 'LED-001', action: 'LEAD_CREATED', description: 'Lead created by Broker Mani', performedBy: 'SYS-ADMIN', timestamp: getDateOffset(-40) },
  { id: 'ACT-004', entityType: 'DEAL', entityId: 'DEL-001', action: 'DEAL_CREATED', description: 'Deal negotiated and booked', performedBy: 'SALES-REP', timestamp: getDateOffset(-25) },
  { id: 'ACT-005', entityType: 'LOAN', entityId: 'LON-001', action: 'LOAN_APPLIED', description: 'Loan application submitted to Chola', performedBy: 'FINANCE-REP', timestamp: getDateOffset(-24) },
  { id: 'ACT-006', entityType: 'LOAN', entityId: 'LON-001', action: 'LOAN_APPROVED', description: 'Loan approved', performedBy: 'FINANCE-REP', timestamp: getDateOffset(-21) },
  { id: 'ACT-007', entityType: 'DEAL', entityId: 'DEL-001', action: 'DEAL_COMPLETED', description: 'Sale completed', performedBy: 'SALES-REP', timestamp: getDateOffset(-20) },
  { id: 'ACT-008', entityType: 'TRUCK', entityId: 'TRK-003', action: 'STATUS_CHANGED', description: 'Status changed to SOLD', performedBy: 'SYSTEM', timestamp: getDateOffset(-20) },
  { id: 'ACT-009', entityType: 'LOAN', entityId: 'LON-001', action: 'LOAN_DISBURSED', description: 'Loan amount disbursed', performedBy: 'FINANCE-REP', timestamp: getDateOffset(-15) },
  { id: 'ACT-010', entityType: 'COMMISSION', entityId: 'COM-001', action: 'COMMISSION_PAID', description: 'Broker commission paid', performedBy: 'FINANCE-REP', timestamp: getDateOffset(-14) },
  { id: 'ACT-011', entityType: 'TRUCK', entityId: 'TRK-002', action: 'DOCUMENT_PENDING', description: 'Waiting for original RC from previous owner', performedBy: 'SYS-ADMIN', timestamp: getDateOffset(-10) },
  { id: 'ACT-012', entityType: 'DEAL', entityId: 'DEL-002', action: 'DEAL_BOOKED', description: 'Customer paid advance', performedBy: 'SALES-REP', timestamp: getDateOffset(-7) },
  { id: 'ACT-013', entityType: 'TRUCK', entityId: 'TRK-004', action: 'STATUS_CHANGED', description: 'Status changed to RESERVED', performedBy: 'SYSTEM', timestamp: getDateOffset(-7) },
  { id: 'ACT-014', entityType: 'LOAN', entityId: 'LON-002', action: 'LOAN_APPLIED', description: 'Loan application submitted to Shriram', performedBy: 'FINANCE-REP', timestamp: getDateOffset(-5) },
  { id: 'ACT-015', entityType: 'TRUCK', entityId: 'TRK-005', action: 'EXPENSE_ADDED', description: 'Engine overhaul expense added', performedBy: 'SERVICE-MGR', timestamp: getDateOffset(-15) },
  { id: 'ACT-016', entityType: 'DEAL', entityId: 'DEL-005', action: 'DEAL_CANCELLED', description: 'Deal cancelled due to loan rejection', performedBy: 'SALES-REP', timestamp: getDateOffset(-95) },
  { id: 'ACT-017', entityType: 'TRUCK', entityId: 'TRK-010', action: 'STATUS_CHANGED', description: 'Status reverted from RESERVED to AVAILABLE', performedBy: 'SYSTEM', timestamp: getDateOffset(-95) },
  { id: 'ACT-018', entityType: 'TRUCK', entityId: 'TRK-010', action: 'STATUS_CHANGED', description: 'Status changed to SOLD (new deal)', performedBy: 'SYSTEM', timestamp: getDateOffset(-90) }
];
