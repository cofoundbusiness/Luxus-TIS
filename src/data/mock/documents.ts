import type { Document } from '../../types';
import { getDateOffset } from './constants';

export const documents: Document[] = [
  { id: 'DOC-001', entityType: 'TRUCK', entityId: 'TRK-001', documentType: 'RC', name: 'RC_Copy_TRK001.pdf', fileUrl: '/mock/docs/rc_001.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-100) },
  { id: 'DOC-002', entityType: 'TRUCK', entityId: 'TRK-001', documentType: 'Insurance', name: 'Ins_TRK001.pdf', fileUrl: '/mock/docs/ins_001.pdf', status: 'EXPIRED', uploadedAt: getDateOffset(-100) },
  { id: 'DOC-003', entityType: 'TRUCK', entityId: 'TRK-002', documentType: 'RC', name: 'RC_TRK002.pdf', fileUrl: '', status: 'PENDING', uploadedAt: getDateOffset(-10) }, // Pending document edge case
  { id: 'DOC-004', entityType: 'DEAL', entityId: 'DEL-001', documentType: 'Sale Agreement', name: 'Sale_Agrm_D001.pdf', fileUrl: '/mock/docs/sale_001.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-20) },
  { id: 'DOC-005', entityType: 'CUSTOMER', entityId: 'CUS-001', documentType: 'Aadhaar', name: 'Aadhaar_C001.pdf', fileUrl: '/mock/docs/aadhaar_001.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-180) },
  { id: 'DOC-006', entityType: 'LOAN', entityId: 'LON-001', documentType: 'Loan Sanction Letter', name: 'Sanction_L001.pdf', fileUrl: '/mock/docs/sanc_001.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-21) },
  { id: 'DOC-007', entityType: 'TRUCK', entityId: 'TRK-003', documentType: 'PUC', name: 'PUC_TRK003.pdf', fileUrl: '/mock/docs/puc_003.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-50) },
  { id: 'DOC-008', entityType: 'DEAL', entityId: 'DEL-002', documentType: 'Booking Receipt', name: 'Receipt_D002.pdf', fileUrl: '/mock/docs/rec_002.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-5) },
  { id: 'DOC-009', entityType: 'LOAN', entityId: 'LON-002', documentType: 'Application Form', name: 'App_L002.pdf', fileUrl: '/mock/docs/app_002.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-5) },
  { id: 'DOC-010', entityType: 'TRUCK', entityId: 'TRK-005', documentType: 'Service Estimate', name: 'Est_TRK005.pdf', fileUrl: '/mock/docs/est_005.pdf', status: 'AVAILABLE', uploadedAt: getDateOffset(-18) }
];
