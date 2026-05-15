import { useRouter } from "expo-router";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActionCard } from "@/components/ui/ActionCard";
import { CameraPermissionModal } from "@/components/scanner/CameraPermissionModal";
import { CartIcon, ScanIcon } from "@/components/ui/icons";
import { Routes } from "@/constants/routes";
import { useCameraScanner } from "@/hooks/useCameraScanner";

export default function HomeScreen() {
  const { push } = useRouter();
  const { openScanner, handleGrantPermission, showPermissionModal, setShowPermissionModal, isDenied } =
    useCameraScanner('search');

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="flex-1 px-6 pt-12 gap-8">
        <View className="gap-1">
          <Text className="text-3xl font-bold text-gray-900 dark:text-white">
            Bodega
          </Text>
          <Text className="text-gray-500 dark:text-gray-400">
            ¿Qué deseas hacer hoy?
          </Text>
        </View>

        <View className="gap-4">
          <ActionCard
            icon={<ScanIcon size={32} color="#2563EB" />}
            title="Escanear Producto"
            description="Escanea el código de barras para ver precio y stock"
            color="bg-blue-50 dark:bg-blue-950"
            onPress={openScanner}
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

      <CameraPermissionModal
        visible={showPermissionModal}
        isDenied={isDenied}
        onClose={() => setShowPermissionModal(false)}
        onGrant={handleGrantPermission}
      />
    </SafeAreaView>
  );
}
