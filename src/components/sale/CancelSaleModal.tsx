import { Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CancelSaleModalProps = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function CancelSaleModal({ visible, onCancel, onConfirm }: CancelSaleModalProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        onPress={onCancel}
      >
        <Pressable
          onPress={() => {}}
          className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 gap-4"
          style={{ paddingBottom: Math.max(bottom, 24) }}
        >
          <View className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full self-center mb-2" />
          <Text className="text-gray-900 dark:text-white text-xl font-semibold">Cancelar venta</Text>
          <Text className="text-gray-500 dark:text-zinc-400 text-sm leading-5">
            Hay productos agregados al carrito. ¿Deseas eliminar la venta?
          </Text>
          <View className="flex-row gap-3 mt-1">
            <Pressable
              onPress={onCancel}
              className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl items-center"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="text-gray-900 dark:text-white font-semibold">Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="flex-1 py-4 bg-red-500 rounded-2xl items-center"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="text-white font-semibold">Eliminar</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
