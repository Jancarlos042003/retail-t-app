import { Pressable, Text, TextInput, View } from 'react-native';

import { formatPrice } from '@/lib/format';
import { isCashMethod } from '@/lib/payment';
import { PaymentMethodType } from '@/types';

type PaymentSelectorProps = {
  methods: PaymentMethodType[];
  selected: PaymentMethodType | null;
  onSelect: (method: PaymentMethodType) => void;
  amountPaid: number;
  onAmountPaidChange: (amount: number) => void;
  change: number | null;
};

export function PaymentSelector({
  methods,
  selected,
  onSelect,
  amountPaid,
  onAmountPaidChange,
  change,
}: PaymentSelectorProps) {
  const showChangeFields = selected !== null && isCashMethod(selected);

  return (
    <View
      className="bg-white rounded-2xl p-4 gap-4"
      style={{ borderCurve: 'continuous', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <Text className="font-semibold text-gray-900">Método de pago</Text>

      <View className="flex-row gap-2 flex-wrap">
        {methods.map((method) => {
          const isSelected = selected?.id === method.id;
          return (
            <Pressable
              key={method.id}
              onPress={() => onSelect(method)}
              className={`px-4 py-2 rounded-xl border ${
                isSelected
                  ? 'bg-blue-500 border-blue-500'
                  : 'bg-white border-gray-200'
              }`}
              style={{ borderCurve: 'continuous' }}
            >
              <Text
                className={`font-medium ${isSelected ? 'text-white' : 'text-gray-700'}`}
              >
                {method.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {showChangeFields ? (
        <View className="gap-3">
          <View className="gap-1">
            <Text className="text-gray-500 text-sm">Monto recibido</Text>
            <TextInput
              value={amountPaid > 0 ? String(amountPaid) : ''}
              onChangeText={(text) => onAmountPaidChange(parseFloat(text) || 0)}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 rounded-xl px-4 py-3 text-gray-900 text-base"
              style={{ borderCurve: 'continuous' }}
            />
          </View>

          {change !== null ? (
            <View className="flex-row justify-between items-center bg-green-50 rounded-xl px-4 py-3">
              <Text className="text-green-700 font-medium">Vuelto</Text>
              <Text className="text-green-700 font-bold text-lg">
                {formatPrice(change)}
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}
