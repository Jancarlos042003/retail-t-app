import { Text, View } from 'react-native';

import { CartIcon } from '@/components/ui/icons';

export function SaleEmptyState() {
  return (
    <View className="flex-1 justify-center items-center gap-4 py-20">
      <CartIcon size={72} color="#9CA3AF" />
      <Text className="text-gray-400 dark:text-gray-500 text-base text-center">
        No hay productos agregados
      </Text>
    </View>
  );
}
