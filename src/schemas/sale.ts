import { z } from 'zod';

export const SaleItemCreateSchema = z.object({
  product_id: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const SalesTransactionCreateSchema = z.object({
  payment_method_id: z.string().uuid(),
  total_amount: z.string(),
  items: z.array(SaleItemCreateSchema),
});

export const SalesTransactionReadSchema = z.object({
  id: z.string().uuid(),
  transaction_date: z.string(),
  total_amount: z.string(),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED', 'REFUNDED']),
});
