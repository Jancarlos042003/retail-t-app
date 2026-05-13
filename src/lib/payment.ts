import { PaymentMethodType } from '@/types';

export const isCashMethod = (method: PaymentMethodType) =>
  method.name.toLowerCase().includes('efectivo');
