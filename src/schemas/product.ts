import { z } from 'zod';

export const ProductBarcodeSchema = z.object({
  id: z.string().uuid(),
  barcode: z.string(),
  name: z.string(),
  image_url: z.string().nullable().optional(),
  min_stock: z.number().int(),
  is_active: z.boolean(),
  selling_price: z.coerce.number().nullable().optional(),
  stock: z.number().int(),
});
