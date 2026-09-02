import { z } from 'zod';
import { LeadStatus } from '../types/enums';

export const leadSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  truckId: z.string().optional(),
  brokerId: z.string().optional(),
  source: z.string().min(1, "Source is required"),
  requirement: z.string().min(1, "Requirement is required"),
  budget: z.number().nonnegative("Budget cannot be negative"),
  status: z.nativeEnum(LeadStatus),
  probability: z.number().min(0).max(100, "Probability must be between 0 and 100"),
  nextFollowUp: z.string().datetime().optional(),
  notes: z.string().optional(),
  assignedTo: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadSchema>;
