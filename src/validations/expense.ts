import { z } from 'zod';
import { ExpenseCategory } from '../types/enums';

export const expenseSchema = z.object({
  id: z.string().optional(),
  truckId: z.string().optional(),
  dealId: z.string().optional(),
  category: z.nativeEnum(ExpenseCategory, {
    errorMap: () => ({ message: 'Invalid expense category' })
  } as any),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  amount: z.number().min(0, 'Amount must be a positive number'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().optional(),
});
