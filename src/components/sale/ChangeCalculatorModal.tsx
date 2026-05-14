import { useEffect, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, Text, TextInput, View } from 'react-native';

import { formatPrice } from '@/lib/format';

type ChangeCalculatorModalProps = {
  visible: boolean;
  total: number;
  isPending: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export function ChangeCalculatorModal({
  visible,
  total,
  isPending,
  onClose,
  onConfirm,
}: ChangeCalculatorModalProps) {
  const [amountPaid, setAmountPaid] = useState('');

  useEffect(() => {
    if (!visible) setAmountPaid('');
  }, [visible]);

  const paid = parseFloat(amountPaid) || 0;
  const change = paid - total;
  const isValid = paid >= total;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-white dark:bg-zinc-900 rounded-t-3xl px-6 pt-3 pb-10 gap-5"
          style={{ borderCurve: 'continuous' }}
        >
          <View className="w-10 h-1 bg-black/10 dark:bg-white/20 rounded-full self-center mb-1" />
          <Text className="text-xl font-bold text-gray-900 dark:text-white">Calcular vuelto</Text>

          <View className="bg-gray-50 dark:bg-zinc-800 rounded-2xl p-4 gap-4">
            <View className="flex-row justify-between items-center">
              <Text className="text-gray-500 dark:text-gray-400">Total a pagar</Text>
              <Text className="font-semibold text-gray-900 dark:text-white">
                {formatPrice(total)}
              </Text>
            </View>

            <View className="gap-1">
              <Text className="text-gray-500 dark:text-gray-400 text-sm">Cliente paga</Text>
              <TextInput
                value={amountPaid}
                onChangeText={setAmountPaid}
                keyboardType="decimal-pad"
                placeholder="0.00"
                placeholderTextColor="#9CA3AF"
                className="border border-gray-200 dark:border-zinc-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white text-base bg-white dark:bg-zinc-900"
                style={{ borderCurve: 'continuous' }}
              />
            </View>

            {isValid ? (
              <View className="flex-row justify-between items-center bg-green-50 dark:bg-green-950 rounded-xl px-4 py-3">
                <Text className="text-green-700 dark:text-green-400 font-medium">Vuelto</Text>
                <Text className="text-green-700 dark:text-green-400 font-bold text-lg">
                  {formatPrice(change)}
                </Text>
              </View>
            ) : null}
          </View>

          <Pressable
            onPress={() => isValid && onConfirm()}
            disabled={!isValid || isPending}
            className={`py-4 rounded-2xl items-center ${
              isValid && !isPending ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-700'
            }`}
            style={{ borderCurve: 'continuous' }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                className={`font-semibold ${
                  isValid ? 'text-white' : 'text-gray-400 dark:text-zinc-500'
                }`}
              >
                Terminar
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
