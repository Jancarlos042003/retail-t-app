import { Linking, Modal, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CameraPermissionModalProps = {
  visible: boolean;
  isDenied: boolean;
  onClose: () => void;
  onGrant: () => void;
};

export function CameraPermissionModal({
  visible,
  isDenied,
  onClose,
  onGrant,
}: CameraPermissionModalProps) {
  const { bottom } = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable
        className="flex-1 justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.65)' }}
        onPress={onClose}
      >
        <Pressable
          onPress={() => {}}
          className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 gap-4"
          style={{ paddingBottom: Math.max(bottom, 24) }}
        >
          <View className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full self-center mb-2" />
          <Text className="text-gray-900 dark:text-white text-xl font-semibold">Permiso de cámara</Text>
          <Text className="text-gray-500 dark:text-zinc-400 text-sm">
            {isDenied
              ? 'El permiso fue denegado. Actívalo desde la configuración del sistema.'
              : 'Para escanear productos necesitamos acceso a tu cámara.'}
          </Text>
          <Pressable
            onPress={isDenied ? () => Linking.openSettings() : onGrant}
            className="bg-blue-500 py-4 rounded-2xl items-center"
            style={{ borderCurve: 'continuous' }}
          >
            <Text className="text-white font-semibold">
              {isDenied ? 'Abrir configuración' : 'Conceder permiso'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
