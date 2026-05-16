import { Text, View } from "react-native";
import Animated, { FadeInDown, FadeOutUp } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AlertIcon, CheckCircleIcon } from "@/components/ui/icons";

type ScannerToastProps =
  | { variant: 'success'; message: string }
  | { variant: 'error'; message: string };

export function ScannerToast({ variant, message }: ScannerToastProps) {
  const { top } = useSafeAreaInsets();

  const isSuccess = variant === 'success';

  return (
    <Animated.View
      entering={FadeInDown.duration(200).springify()}
      exiting={FadeOutUp.duration(180)}
      className={`absolute left-4 right-4 rounded-2xl px-4 py-3 flex-row items-center gap-3 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}
      style={{ top: top + 56, borderCurve: "continuous" }}
    >
      {isSuccess
        ? <CheckCircleIcon size={22} color="#fff" />
        : <AlertIcon size={22} color="#fff" />
      }
      <View className="flex-1">
        <Text className="text-white font-semibold text-sm" numberOfLines={1}>
          {message}
        </Text>
        {isSuccess ? (
          <Text className="text-white/80 text-xs">Agregado al carrito</Text>
        ) : null}
      </View>
    </Animated.View>
  );
}
