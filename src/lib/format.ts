const priceFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (amount: number | null | undefined): string =>
  amount != null ? `S/. ${priceFormatter.format(amount)}` : 'Sin precio';
