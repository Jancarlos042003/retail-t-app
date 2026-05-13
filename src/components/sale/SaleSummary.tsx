import { Text, View } from 'react-native';

import { formatPrice } from '@/lib/format';

type SaleSummaryProps = {
  total: number;
  itemCount: number;
};

export function SaleSummary({ total, itemCount }: SaleSummaryProps) {
  return (
    <View
      className="bg-white dark:bg-zinc-900 rounded-2xl p-4 gap-2"
      style={{ borderCurve: 'continuous', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <View className="flex-row justify-between">
        <Text className="text-gray-500 dark:text-gray-400">Productos</Text>
        <Text className="text-gray-700 dark:text-gray-300 font-medium">{itemCount}</Text>
      </View>

      <View className="h-px bg-gray-100 dark:bg-zinc-800" />

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-900 dark:text-white font-semibold text-base">Total</Text>
        <Text className="text-blue-600 font-bold text-xl">{formatPrice(total)}</Text>
      </View>
    </View>
  );
}
