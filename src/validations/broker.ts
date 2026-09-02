import { z } from 'zod';
import { BrokerStatus } from '../types/enums';

export const brokerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  companyName: z.string().optional(),
  phone: z.string().min(1, "Phone number is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  city: z.string().optional(),
  notes: z.string().optional(),
  status: z.nativeEnum(BrokerStatus)
});

export type BrokerInput = z.infer<typeof brokerSchema>;
