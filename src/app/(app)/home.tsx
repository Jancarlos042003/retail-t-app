import { useRouter } from "expo-router";
import { useState } from "react";
import { Linking, Modal, Pressable, Text, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useCameraPermission } from "react-native-vision-camera";

import { CartIcon, ScanIcon } from "@/components/ui/icons";
import { Routes } from "@/constants/routes";

export default function HomeScreen() {
  const { push } = useRouter();
  const { bottom } = useSafeAreaInsets();
  const { hasPermission, canRequestPermission, requestPermission } =
    useCameraPermission();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const handleScanPress = () => {
    if (hasPermission) {
      push(Routes.scanner);
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleGrantPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionModal(false);
      push(Routes.scanner);
    }
  };

  const denied = !canRequestPermission;

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
            onPress={handleScanPress}
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
      <Modal
        visible={showPermissionModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPermissionModal(false)}
      >
        <Pressable
          className="flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0.65)" }}
          onPress={() => setShowPermissionModal(false)}
        >
          <Pressable
            onPress={() => {}}
            className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 gap-4"
            style={{ paddingBottom: Math.max(bottom, 24) }}
          >
            <View className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full self-center mb-2" />
            <Text className="text-gray-900 dark:text-white text-xl font-semibold">
              Permiso de cámara
            </Text>
            <Text className="text-gray-500 dark:text-zinc-400 text-sm">
              {denied
                ? "El permiso fue denegado. Actívalo desde la configuración del sistema."
                : "Para escanear productos necesitamos acceso a tu cámara."}
            </Text>
            <Pressable
              onPress={
                denied ? () => Linking.openSettings() : handleGrantPermission
              }
              className="bg-blue-500 py-4 rounded-2xl items-center"
              style={{ borderCurve: "continuous" }}
            >
              <Text className="text-white font-semibold">
                {denied ? "Abrir configuración" : "Conceder permiso"}
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
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

function ActionCard({
  icon,
  title,
  description,
  color,
  onPress,
}: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-zinc-900 rounded-3xl p-5 flex-row items-center gap-4 active:opacity-80"
      style={{
        borderCurve: "continuous",
        boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      <View
        className={`w-16 h-16 ${color} rounded-2xl items-center justify-center`}
      >
        {icon}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-bold text-gray-900 dark:text-white text-base">
          {title}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm">
          {description}
        </Text>
      </View>
    </Pressable>
  );
}
