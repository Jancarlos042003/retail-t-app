import { useEffect } from 'react';
import { Keyboard, Modal, Platform, StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

export function BottomSheetModal({ visible, onRequestClose, children }: BottomSheetModalProps) {
  const { bottom } = useSafeAreaInsets();
  const translateY = useSharedValue(0);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      translateY.value = withTiming(-e.endCoordinates.height, {
        duration: Platform.OS === 'ios' ? e.duration : 220,
      });
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      translateY.value = withTiming(0, {
        duration: Platform.OS === 'ios' ? e.duration : 220,
      });
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [translateY]);

  useEffect(() => {
    if (!visible) translateY.value = 0;
  }, [visible, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <Animated.View
          className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 gap-5"
          style={[
            { borderCurve: 'continuous', paddingBottom: Math.max(bottom, 24) },
            animatedStyle,
          ]}
        >
          <View className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full self-center mb-1" />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
