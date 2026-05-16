import { ActivityIndicator, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type ScannerOverlayProps = {
  isLoading: boolean;
  showHint: boolean;
};

// Debe coincidir con la altura de los botones de control en ScannerControls
const CONTROLS_HEIGHT = 56;
const CONTROLS_BOTTOM_PADDING = 16;
const HINT_GAP = 10;

export function ScannerOverlay({ isLoading, showHint }: ScannerOverlayProps) {
  const { bottom } = useSafeAreaInsets();

  const hintBottom = Math.max(bottom, 16) + CONTROLS_BOTTOM_PADDING + CONTROLS_HEIGHT + HINT_GAP;

  return (
    <View className="absolute inset-0 items-center justify-center">
      {isLoading ? (
        <View className="bg-black/50 rounded-full p-4">
          <ActivityIndicator size="large" color="#fff" />
        </View>
      ) : null}

      {showHint ? (
        <View
          className="absolute left-4 right-4 bg-black/55 rounded-2xl px-4 py-3"
          style={{ bottom: hintBottom, borderCurve: 'continuous' }}
        >
          <Text className="text-white/60 text-sm text-center">
            Apunta la cámara al código de barras
          </Text>
        </View>
      ) : null}
    </View>
  );
}
