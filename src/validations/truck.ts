import { z } from 'zod';
import { TruckStatus } from '../types/enums';

export const truckSchema = z.object({
  registrationNumber: z.string().min(1, "Registration number is required"),
  chassisNumber: z.string().min(1, "Chassis number is required"),
  manufacturer: z.string().min(1, "Manufacturer is required"),
  model: z.string().min(1, "Model is required"),
  variant: z.string().min(1, "Variant is required"),
  year: z.number().int().min(1980).max(new Date().getFullYear() + 1),
  mileage: z.number().nonnegative("Mileage cannot be negative"),
  fuelType: z.string().min(1, "Fuel type is required"),
  transmission: z.string().min(1, "Transmission is required"),
  condition: z.string().min(1, "Condition is required"),
  purchasePrice: z.number().nonnegative("Purchase price cannot be negative"),
  sellingPrice: z.number().nonnegative("Selling price cannot be negative"),
  expectedProfit: z.number(),
  location: z.string().min(1, "Location is required"),
  status: z.nativeEnum(TruckStatus),
  purchaseDate: z.string().datetime()
});

export type TruckInput = z.infer<typeof truckSchema>;
