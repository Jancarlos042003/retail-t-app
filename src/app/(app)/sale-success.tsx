import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CheckCircleIcon } from '@/components/ui/icons';
import { Routes } from '@/constants/routes';
import { formatPrice } from '@/lib/format';
import { useSaleStore } from '@/store/saleStore';

export default function SaleSuccessScreen() {
  const { replace } = useRouter();
  const lastSale = useSaleStore((s) => s.lastSale);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="flex-1 justify-center items-center px-6 gap-6">
        <CheckCircleIcon size={96} color="#22C55E" />

        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white text-center">
            Venta registrada correctamente
          </Text>
          {lastSale ? (
            <View className="items-center gap-1 mt-1">
              <Text className="text-3xl font-bold text-blue-600">
                {formatPrice(lastSale.total)}
              </Text>
              <Text className="text-gray-500 dark:text-gray-400 text-sm">
                {lastSale.paymentMethodName}
              </Text>
            </View>
          ) : null}
        </View>

        <Pressable
          onPress={() => replace(Routes.newSale)}
          className="w-full py-4 bg-blue-500 rounded-2xl items-center"
          style={{ borderCurve: 'continuous' }}
        >
          <Text className="text-white font-bold text-base">Aceptar</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
