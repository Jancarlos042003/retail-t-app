import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CheckCircleIcon } from "@/components/ui/icons";

type ScannerToastProps = {
  productName: string;
};

export function ScannerToast({ productName }: ScannerToastProps) {
  const { top } = useSafeAreaInsets();

  return (
    <Animated.View
      entering={FadeInDown.duration(200).springify()}
      exiting={FadeOutUp.duration(180)}
      className="absolute left-4 right-4 bg-green-500 rounded-2xl px-4 py-3 flex-row items-center gap-3"
      style={{ top: top + 56, borderCurve: "continuous" }}
    >
      <CheckCircleIcon size={22} color="#fff" />
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {productName}
        </Text>
        <Text className="text-white/80 text-xs">Agregado al carrito</Text>
      </View>
    </Animated.View>
  );
}
