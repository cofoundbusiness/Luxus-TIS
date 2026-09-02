import { z } from 'zod';
import { FinancePartnerStatus } from '../types/enums';

export const financePartnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactPerson: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  commissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100"),
  status: z.nativeEnum(FinancePartnerStatus),
  notes: z.string().optional()
});

export type FinancePartnerInput = z.infer<typeof financePartnerSchema>;
