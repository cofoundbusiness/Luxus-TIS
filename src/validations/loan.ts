import { z } from 'zod';
import { LoanStatus } from '../types/enums';

export const loanSchema = z.object({
  dealId: z.string().min(1, "Deal is required"),
  customerId: z.string().min(1, "Customer is required"),
  truckId: z.string().min(1, "Truck is required"),
  financePartnerId: z.string().min(1, "Finance Partner is required"),
  loanAmount: z.number().positive("Loan amount must be positive"),
  commissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100"),
  status: z.nativeEnum(LoanStatus),
  applicationDate: z.string().datetime(),
  approvalDate: z.string().datetime().optional(),
  receivedDate: z.string().datetime().optional(),
  notes: z.string().optional()
});

export type LoanInput = z.infer<typeof loanSchema>;
