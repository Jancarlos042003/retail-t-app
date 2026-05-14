import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CartIcon, CloseIcon, PriceTagIcon, SearchIcon } from '@/components/ui/icons';

type ScannerControlsProps = {
  isSaleMode: boolean;
  itemCount: number;
  onCancel: () => void;
  onToggleMode: () => void;
  onGoToCart: () => void;
};

type ControlButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
};

function ControlButton({ onPress, children }: ControlButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="w-14 h-14 bg-black/50 rounded-full items-center justify-center"
    >
      {children}
    </Pressable>
  );
}

export function ScannerControls({
  isSaleMode,
  itemCount,
  onCancel,
  onToggleMode,
  onGoToCart,
}: ScannerControlsProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="absolute left-0 right-0 items-center flex-row justify-center gap-6"
      style={{ bottom: Math.max(bottom, 16) + 16 }}
    >
      {isSaleMode ? (
        <ControlButton onPress={onCancel}>
          <CloseIcon size={26} color="#fff" />
        </ControlButton>
      ) : null}

      <ControlButton onPress={onToggleMode}>
        {isSaleMode
          ? <SearchIcon size={26} color="#fff" />
          : <PriceTagIcon size={26} color="#fff" />
        }
      </ControlButton>

      {isSaleMode ? (
        <View>
          <ControlButton onPress={onGoToCart}>
            <CartIcon size={26} color="#fff" />
          </ControlButton>
          {itemCount > 0 ? (
            <View className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 rounded-full items-center justify-center px-1">
              <Text className="text-white text-xs font-bold">{itemCount}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
