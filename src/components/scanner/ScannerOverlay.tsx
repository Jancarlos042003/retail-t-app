import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AlertIcon } from '@/components/ui/icons';

type ScannerOverlayProps = {
  isLoading: boolean;
  errorMessage?: string;
};

export function ScannerOverlay({ isLoading, errorMessage }: ScannerOverlayProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View className="absolute inset-0 items-center justify-center">
      {isLoading ? (
        <View className="bg-black/50 rounded-full p-4">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : null}

      <View
        className="absolute left-4 right-4 bg-black/55 rounded-2xl px-4 py-3 flex-row items-center gap-3"
        style={{ bottom: bottom + 100, borderCurve: 'continuous' }}
      >
        {errorMessage ? (
          <>
            <AlertIcon size={20} color="#F87171" />
            <Text className="text-red-400 text-sm font-medium flex-1">
              {errorMessage}
            </Text>
          </>
        ) : (
          <Text className="text-white/60 text-sm text-center flex-1">
            Apunta la cámara al código de barras
          </Text>
        )}
      </View>
    </View>
  );
}
