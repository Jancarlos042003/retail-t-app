import { z } from 'zod';

import { PaymentMethodSchema } from '@/schemas/payment';
import { ProductBarcodeSchema } from '@/schemas/product';
import {
  SaleItemCreateSchema,
  SalesTransactionCreateSchema,
  SalesTransactionReadSchema,
} from '@/schemas/sale';

export type ProductBarcodeType = z.infer<typeof ProductBarcodeSchema>;
export type PaymentMethodType = z.infer<typeof PaymentMethodSchema>;
export type SaleItemCreateType = z.infer<typeof SaleItemCreateSchema>;
export type SalesTransactionCreateType = z.infer<typeof SalesTransactionCreateSchema>;
export type SalesTransactionReadType = z.infer<typeof SalesTransactionReadSchema>;
