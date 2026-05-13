import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import { PaymentMethodListSchema } from '@/schemas/payment';

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () =>
      api.get('/payment-methods/').then((r) => PaymentMethodListSchema.parse(r.data)),
    staleTime: Infinity,
    retry: false,
  });
}
