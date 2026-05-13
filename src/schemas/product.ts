import { z } from 'zod';

export const ProductBarcodeSchema = z.object({
  id: z.string().uuid(),
  barcode: z.string(),
  name: z.string(),
  category_id: z.string().uuid(),
  image_url: z.string().nullable().optional(),
  min_stock: z.number().int(),
  is_active: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  selling_price: z.coerce.number(),
  stock: z.number().int(),
});
