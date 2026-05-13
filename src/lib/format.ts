// Formateador hoisted — evita recrear el objeto Intl en cada render
const priceFormatter = new Intl.NumberFormat('es-PE', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export const formatPrice = (amount: number) => `S/. ${priceFormatter.format(amount)}`;
