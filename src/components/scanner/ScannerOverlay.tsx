import { ActivityIndicator, Text, View } from 'react-native';

import { AlertIcon } from '@/components/ui/icons';

type ScannerOverlayProps = {
  isLoading: boolean;
  errorMessage?: string;
};

export function ScannerOverlay({ isLoading, errorMessage }: ScannerOverlayProps) {
  return (
    <View className="absolute inset-0">
      <View className="flex-1 bg-black/60" />

      <View className="flex-row" style={{ height: 260 }}>
        <View className="flex-1 bg-black/60" />

        <View
          className="w-64 border-2 border-blue-400 rounded-2xl overflow-hidden justify-center items-center"
          style={{ borderCurve: 'continuous' }}
        >
          {isLoading ? (
            <ActivityIndicator size="large" color="#60A5FA" />
          ) : (
            <View className="absolute w-full h-px bg-blue-400 opacity-80" />
          )}
        </View>

        <View className="flex-1 bg-black/60" />
      </View>

      <View className="flex-1 bg-black/60 items-center pt-6 gap-2">
        {errorMessage ? (
          <>
            <AlertIcon size={28} color="#F87171" />
            <Text className="text-red-400 text-sm font-medium text-center px-8">
              {errorMessage}
            </Text>
          </>
        ) : (
          <Text className="text-white/70 text-sm text-center px-8">
            Apunta el código de barras al visor
          </Text>
        )}
      </View>
    </View>
  );
}
