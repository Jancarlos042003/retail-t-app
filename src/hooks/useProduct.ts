import { useQuery } from '@tanstack/react-query';

import api from '@/lib/api';
import { ProductBarcodeSchema } from '@/schemas/product';

export function useProduct(barcode: string | null) {
  return useQuery({
    queryKey: ['product', barcode],
    queryFn: () =>
      api
        .get(`/products/barcode/${barcode}`)
        .then((r) => ProductBarcodeSchema.parse(r.data)),
    enabled: barcode !== null,
  });
}
