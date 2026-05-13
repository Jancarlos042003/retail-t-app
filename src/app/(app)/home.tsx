import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CartIcon, ScanIcon } from '@/components/ui/icons';
import { Routes } from '@/constants/routes';

export default function HomeScreen() {
  const { push } = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="flex-1 px-6 pt-12 gap-8">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">Bodega</Text>
          <Text className="text-gray-500 dark:text-gray-400">¿Qué deseas hacer hoy?</Text>
        </View>

        <View className="gap-4">
          <ActionCard
            icon={<ScanIcon size={32} color="#2563EB" />}
            title="Escanear Producto"
            description="Escanea el código de barras para ver precio y stock"
            color="bg-blue-50 dark:bg-blue-950"
            onPress={() => push(Routes.scanner)}
          />

          <ActionCard
            icon={<CartIcon size={32} color="#059669" />}
            title="Nueva Venta"
            description="Gestiona los productos del carrito y registra la venta"
            color="bg-emerald-50 dark:bg-emerald-950"
            onPress={() => push(Routes.newSale)}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
};

function ActionCard({ icon, title, description, color, onPress }: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-zinc-900 rounded-3xl p-5 flex-row items-center gap-4 active:opacity-80"
      style={{ borderCurve: 'continuous', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
    >
      <View className={`w-16 h-16 ${color} rounded-2xl items-center justify-center`}>
        {icon}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-bold text-gray-900 dark:text-white text-base">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm">{description}</Text>
      </View>
    </Pressable>
  );
}
