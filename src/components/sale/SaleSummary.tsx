import { Text, View } from 'react-native';

import { formatPrice } from '@/lib/format';

type SaleSummaryProps = {
  total: number;
  itemCount: number;
};

export function SaleSummary({ total, itemCount }: SaleSummaryProps) {
  return (
    <View
      className="bg-white rounded-2xl p-4 gap-2"
      style={{ borderCurve: 'continuous', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <View className="flex-row justify-between">
        <Text className="text-gray-500">Productos</Text>
        <Text className="text-gray-700 font-medium">{itemCount}</Text>
      </View>

      <View className="h-px bg-gray-100" />

      <View className="flex-row justify-between items-center">
        <Text className="text-gray-900 font-semibold text-base">Total</Text>
        <Text className="text-blue-600 font-bold text-xl">{formatPrice(total)}</Text>
      </View>
    </View>
  );
}
