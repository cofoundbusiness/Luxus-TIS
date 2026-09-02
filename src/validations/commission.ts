import { z } from 'zod';
import { CommissionType, CommissionStatus } from '../types/enums';

export const commissionSchema = z.object({
  type: z.nativeEnum(CommissionType),
  dealId: z.string().min(1, "Deal is required"),
  brokerId: z.string().optional(),
  loanId: z.string().optional(),
  amount: z.number().nonnegative("Commission amount cannot be negative"),
  rate: z.number().min(0).max(100).optional(),
  status: z.nativeEnum(CommissionStatus),
  dueDate: z.string().datetime().optional(),
  paidDate: z.string().datetime().optional(),
  notes: z.string().optional()
});

export type CommissionInput = z.infer<typeof commissionSchema>;
