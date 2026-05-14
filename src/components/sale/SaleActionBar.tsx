import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SaleActionBarProps = {
  hasItems: boolean;
  isSaleValid: boolean;
  isPending: boolean;
  onAdd: () => void;
  onSell: () => void;
};

export function SaleActionBar({ hasItems, isSaleValid, isPending, onAdd, onSell }: SaleActionBarProps) {
  const { bottom } = useSafeAreaInsets();

  return (
    <View
      className="flex-row gap-3 px-5 pt-4 bg-white dark:bg-zinc-900 border-t border-gray-100 dark:border-zinc-800"
      style={{
        paddingBottom: Math.max(bottom, 16),
        boxShadow: '0 -2px 12px rgba(0,0,0,0.06)',
      }}
    >
      <Pressable
        onPress={onAdd}
        className="flex-1 py-4 bg-blue-500 rounded-2xl items-center"
        style={{ borderCurve: 'continuous' }}
      >
        <Text className="font-semibold text-white">Agregar</Text>
      </Pressable>

      {hasItems ? (
        <Pressable
          onPress={onSell}
          disabled={!isSaleValid || isPending}
          className={`flex-1 py-4 rounded-2xl items-center ${
            isSaleValid && !isPending ? 'bg-green-500' : 'bg-gray-200 dark:bg-zinc-700'
          }`}
          style={{ borderCurve: 'continuous' }}
        >
          <Text
            className={`font-semibold ${
              isSaleValid ? 'text-white' : 'text-gray-400 dark:text-zinc-500'
            }`}
          >
            Realizar Venta
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
