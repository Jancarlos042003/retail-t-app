import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { CheckCircleIcon } from '@/components/ui/icons';
import { Routes } from '@/constants/routes';

export default function SaleSuccessScreen() {
  const { replace } = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="flex-1 justify-center items-center px-6 gap-6">
        <CheckCircleIcon size={96} color="#22C55E" />

        <View className="items-center gap-2">
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">
            Venta registrada correctamente
          </Text>
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
