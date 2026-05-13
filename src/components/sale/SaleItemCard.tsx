import { Image } from 'expo-image';
import { Pressable, Text, View, useColorScheme } from 'react-native';

import { MinusIcon, PlusIcon, TrashIcon } from '@/components/ui/icons';
import { formatPrice } from '@/lib/format';
import { useSaleStore } from '@/store/saleStore';

type SaleItemCardProps = {
  productId: string;
  productName: string;
  imageUrl: string | null | undefined;
  sellingPrice: number;
  quantity: number;
  subtotal: number;
};

export function SaleItemCard({
  productId,
  productName,
  imageUrl,
  sellingPrice,
  quantity,
  subtotal,
}: SaleItemCardProps) {
  const changeQuantity = useSaleStore((s) => s.changeQuantity);
  const removeProduct = useSaleStore((s) => s.removeProduct);
  const colorScheme = useColorScheme();
  const minusColor = colorScheme === 'dark' ? '#9CA3AF' : '#374151';

  return (
    <View
      className="flex-row items-center bg-white dark:bg-zinc-900 rounded-2xl p-3 gap-3"
      style={{ borderCurve: 'continuous', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}
    >
      <Image
        source={imageUrl ? { uri: imageUrl } : require('../../../assets/images/icon.png')}
        style={{ width: 64, height: 64, borderRadius: 12 }}
        contentFit="cover"
        cachePolicy="memory-disk"
        recyclingKey={productId}
      />

      <View className="flex-1 gap-1">
        <Text className="font-semibold text-gray-900 dark:text-white" numberOfLines={2}>
          {productName}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400">
          {formatPrice(sellingPrice)} c/u
        </Text>

        <View className="flex-row items-center gap-2 mt-1">
          <Pressable
            onPress={() => changeQuantity(productId, -1)}
            className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center"
          >
            <MinusIcon size={16} color={minusColor} />
          </Pressable>

          <Text className="font-bold text-gray-900 dark:text-white w-6 text-center">{quantity}</Text>

          <Pressable
            onPress={() => changeQuantity(productId, 1)}
            className="w-8 h-8 bg-blue-100 dark:bg-blue-950 rounded-full items-center justify-center"
          >
            <PlusIcon size={16} color="#2563EB" />
          </Pressable>
        </View>
      </View>

      <View className="items-end gap-2">
        <Text className="font-bold text-gray-900 dark:text-white">{formatPrice(subtotal)}</Text>
        <Pressable
          onPress={() => removeProduct(productId)}
          className="w-8 h-8 bg-red-50 dark:bg-red-950 rounded-full items-center justify-center"
        >
          <TrashIcon size={16} color="#EF4444" />
        </Pressable>
      </View>
    </View>
  );
}
