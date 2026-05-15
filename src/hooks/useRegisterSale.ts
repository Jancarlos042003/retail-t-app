import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';

import { Routes } from '@/constants/routes';
import api from '@/lib/api';
import { queryClient } from '@/lib/queryClient';
import { useSaleStore } from '@/store/saleStore';

type SalePayload = {
  payment_method_id: string;
  total_amount: string;
  items: Array<{ product_id: string; quantity: number }>;
};

type SaleMutationVars = SalePayload & {
  total: number;
  paymentMethodName: string;
};

export function useRegisterSale() {
  const { replace } = useRouter();
  const { setLastSale, clearSale } = useSaleStore();

  return useMutation({
    mutationFn: ({ payment_method_id, total_amount, items }: SaleMutationVars) =>
      api.post('/sales/', { payment_method_id, total_amount, items } satisfies SalePayload).then((r) => r.data),

    onSuccess: (_, { total, paymentMethodName }) => {
      setLastSale({ total, paymentMethodName });
      clearSale();
      queryClient.invalidateQueries({ queryKey: ['product'] });
      replace(Routes.saleSuccess);
    },
  });
}
