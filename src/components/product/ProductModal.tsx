import { Image } from 'expo-image';
import { Modal, Pressable, Text, View } from 'react-native';

import { useSaleStore } from '@/store/saleStore';
import { ProductBarcodeType } from '@/types';
import { formatPrice } from '@/lib/format';

type ProductModalProps = {
  product: ProductBarcodeType | null;
  visible: boolean;
  onClose: () => void;
};

export function ProductModal({ product, visible, onClose }: ProductModalProps) {
  const { addProduct } = useSaleStore();

  const handleAdd = () => {
    if (product) addProduct(product);
    onClose();
  };

  if (!product) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View
          className="bg-white rounded-t-3xl px-6 pt-6 pb-10"
          style={{ borderCurve: 'continuous' }}
        >
          <View className="items-center mb-5">
            <Image
              source={product.image_url ? { uri: product.image_url } : require('../../../assets/images/icon.png')}
              style={{ width: 120, height: 120, borderRadius: 16 }}
              contentFit="cover"
              transition={200}
              cachePolicy="memory-disk"
            />
          </View>

          <View className="gap-1 mb-6">
            <Text className="text-lg font-semibold text-gray-900">{product.name}</Text>
            <Text className="text-2xl font-bold text-blue-600">{formatPrice(product.selling_price)}</Text>
            <Text className="text-gray-500">
              Stock disponible: {product.stock} unidades
            </Text>
          </View>

          {product.stock <= product.min_stock ? (
            <View className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2 mb-4">
              <Text className="text-amber-700 text-sm font-medium">
                ⚠ Stock bajo — mínimo configurado: {product.min_stock}
              </Text>
            </View>
          ) : null}

          <View className="flex-row gap-3">
            <Pressable
              onPress={onClose}
              className="flex-1 py-4 bg-gray-100 rounded-2xl items-center"
              style={{ borderCurve: 'continuous' }}
            >
              <Text className="font-semibold text-gray-700">Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleAdd}
              disabled={product.stock === 0}
              className={`flex-1 py-4 rounded-2xl items-center ${
                product.stock === 0 ? 'bg-gray-200' : 'bg-blue-500'
              }`}
              style={{ borderCurve: 'continuous' }}
            >
              <Text
                className={`font-semibold ${
                  product.stock === 0 ? 'text-gray-400' : 'text-white'
                }`}
              >
                {product.stock === 0 ? 'Sin stock' : 'Agregar a venta'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
