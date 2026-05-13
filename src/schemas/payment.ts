import { z } from 'zod';

export const PaymentMethodSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export const PaymentMethodListSchema = z.array(PaymentMethodSchema);
