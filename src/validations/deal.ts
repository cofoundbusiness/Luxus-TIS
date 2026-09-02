import { z } from 'zod';
import { DealStatus } from '../types/enums';

export const dealSchema = z.object({
  truckId: z.string().min(1, "Truck is required"),
  customerId: z.string().min(1, "Customer is required"),
  brokerId: z.string().optional(),
  salePrice: z.number().nonnegative("Sale price cannot be negative"),
  saleDate: z.string().datetime(),
  status: z.nativeEnum(DealStatus),
  notes: z.string().optional()
});

export type DealInput = z.infer<typeof dealSchema>;
