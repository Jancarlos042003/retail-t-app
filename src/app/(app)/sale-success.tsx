import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { CheckCircleIcon } from '@/components/ui/icons';
import { Routes } from '@/constants/routes';
import { formatPrice } from '@/lib/format';
import { useSaleStore } from '@/store/saleStore';

export default function SaleSuccessScreen() {
  const { replace } = useRouter();
  const lastSale = useSaleStore((s) => s.lastSale);

  const handleGoHome = () => {
    replace(Routes.home);
  };

  const handleNewSale = () => {
    replace(Routes.scanner);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="flex-1 justify-center items-center px-6 gap-6">
        <CheckCircleIcon size={96} color="#22C55E" />

        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">¡Venta registrada!</Text>
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            La venta fue procesada correctamente
          </Text>
        </View>

        {lastSale ? (
          <View
            className="w-full bg-white dark:bg-zinc-900 rounded-3xl p-6 gap-3"
            style={{ borderCurve: 'continuous', boxShadow: '0 2px 12px rgba(0,0,0,0.08)' }}
          >
            <View className="flex-row justify-between">
              <Text className="text-gray-500 dark:text-gray-400">Método de pago</Text>
              <Text className="font-semibold text-gray-900 dark:text-white">{lastSale.paymentMethodName}</Text>
            </View>

            <View className="h-px bg-gray-100 dark:bg-zinc-800" />

            <View className="flex-row justify-between items-center">
              <Text className="text-gray-700 dark:text-gray-300 font-medium">Total cobrado</Text>
              <Text className="text-blue-600 font-bold text-xl">
                {formatPrice(lastSale.total)}
              </Text>
            </View>
          </View>
        ) : null}

        <View className="w-full gap-3">
          <Pressable
            onPress={handleNewSale}
            className="w-full py-4 bg-blue-500 rounded-2xl items-center"
            style={{ borderCurve: 'continuous' }}
          >
            <Text className="text-white font-bold text-base">Nueva Venta</Text>
          </Pressable>

          <Pressable
            onPress={handleGoHome}
            className="w-full py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl items-center"
            style={{ borderCurve: 'continuous' }}
          >
            <Text className="text-gray-700 dark:text-gray-300 font-semibold">Ir al inicio</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
