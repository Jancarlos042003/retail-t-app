import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { BottomSheetModal } from '@/components/ui/BottomSheetModal';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { isCashMethod } from '@/lib/payment';
import { PaymentMethodType } from '@/types';

import { ChangeCalculatorModal } from './ChangeCalculatorModal';

type PaymentModalProps = {
  visible: boolean;
  total: number;
  isPending: boolean;
  onClose: () => void;
  onRegister: (method: PaymentMethodType) => void;
};

function PaymentMethodOption({
  method,
  isSelected,
  onSelect,
}: {
  method: PaymentMethodType;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <Pressable
      onPress={onSelect}
      className={`flex-row items-center gap-3 px-4 py-4 rounded-2xl border ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-950 border-blue-400'
          : 'bg-gray-50 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700'
      }`}
      style={{ borderCurve: 'continuous' }}
    >
      <View
        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
          isSelected ? 'border-blue-500' : 'border-gray-300 dark:border-zinc-600'
        }`}
      >
        {isSelected ? <View className="w-2.5 h-2.5 rounded-full bg-blue-500" /> : null}
      </View>
      <Text
        className={`font-medium ${
          isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
        }`}
      >
        {method.name}
      </Text>
    </Pressable>
  );
}

export function PaymentModal({
  visible,
  total,
  isPending,
  onClose,
  onRegister,
}: PaymentModalProps) {
  const { data: methods, isLoading } = usePaymentMethods();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethodType | null>(null);
  const [showChangeCalc, setShowChangeCalc] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSelectedMethod(null);
      setShowChangeCalc(false);
    }
  }, [visible]);

  const isCash = selectedMethod !== null && isCashMethod(selectedMethod);

  const handleTerminar = () => {
    if (!selectedMethod || isCash) return;
    onRegister(selectedMethod);
  };

  return (
    <>
      <BottomSheetModal visible={visible && !showChangeCalc} onRequestClose={onClose}>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Método de pago</Text>

        {isLoading ? (
          <ActivityIndicator className="py-4" />
        ) : (
          <View className="gap-3">
            {(methods ?? []).map((method) => (
              <PaymentMethodOption
                key={method.id}
                method={method}
                isSelected={selectedMethod?.id === method.id}
                onSelect={() => setSelectedMethod(method)}
              />
            ))}
          </View>
        )}

        {isCash ? (
          <Pressable
            onPress={() => setShowChangeCalc(true)}
            className="py-4 bg-blue-500 rounded-2xl items-center"
            style={{ borderCurve: 'continuous' }}
          >
            <Text className="text-white font-semibold">Continuar</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleTerminar}
            disabled={!selectedMethod || isPending}
            className={`py-4 rounded-2xl items-center ${
              selectedMethod && !isPending ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-700'
            }`}
            style={{ borderCurve: 'continuous' }}
          >
            {isPending ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text
                className={`font-semibold ${
                  selectedMethod ? 'text-white' : 'text-gray-400 dark:text-zinc-500'
                }`}
              >
                Terminar
              </Text>
            )}
          </Pressable>
        )}
      </BottomSheetModal>

      <ChangeCalculatorModal
        visible={showChangeCalc}
        total={total}
        isPending={isPending}
        onClose={() => setShowChangeCalc(false)}
        onConfirm={() => selectedMethod && onRegister(selectedMethod)}
      />
    </>
  );
}
