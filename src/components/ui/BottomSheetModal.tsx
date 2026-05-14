import { useEffect, useRef } from 'react';
import { Animated, Keyboard, Modal, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type BottomSheetModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  children: React.ReactNode;
};

export function BottomSheetModal({ visible, onRequestClose, children }: BottomSheetModalProps) {
  const { bottom } = useSafeAreaInsets();
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = Keyboard.addListener(showEvent, (e) => {
      Animated.timing(translateY, {
        toValue: -e.endCoordinates.height,
        duration: Platform.OS === 'ios' ? e.duration : 220,
        useNativeDriver: true,
      }).start();
    });

    const onHide = Keyboard.addListener(hideEvent, (e) => {
      Animated.timing(translateY, {
        toValue: 0,
        duration: Platform.OS === 'ios' ? e.duration : 220,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      onShow.remove();
      onHide.remove();
    };
  }, [translateY]);

  useEffect(() => {
    if (!visible) translateY.setValue(0);
  }, [visible, translateY]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <View style={styles.backdrop}>
        <Animated.View
          className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 gap-5"
          style={[
            { borderCurve: 'continuous', paddingBottom: Math.max(bottom, 24) },
            { transform: [{ translateY }] },
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
