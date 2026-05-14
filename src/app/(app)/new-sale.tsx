import { useMemo, useState } from 'react';
import { FlatList, Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

import { CancelSaleModal } from '@/components/sale/CancelSaleModal';
import { PaymentModal } from '@/components/sale/PaymentModal';
import { SaleItemCard } from '@/components/sale/SaleItemCard';
import { SaleSummary } from '@/components/sale/SaleSummary';
import { CameraPermissionModal } from '@/components/scanner/CameraPermissionModal';
import { Routes } from '@/constants/routes';
import { useCameraScanner } from '@/hooks/useCameraScanner';
import { useRegisterSale } from '@/hooks/useRegisterSale';
import { useSaleStore, SaleItem } from '@/store/saleStore';
import { PaymentMethodType } from '@/types';

const renderItem = ({ item }: { item: SaleItem }) => (
  <SaleItemCard
    productId={item.product.id}
    productName={item.product.name}
    imageUrl={item.product.image_url}
    sellingPrice={item.product.selling_price}
    quantity={item.quantity}
    subtotal={item.subtotal}
  />
);

const keyExtractor = (item: SaleItem) => item.product.id;

const ItemSeparator = () => <View className="h-3" />;

function SaleListHeader() {
  return (
    <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Nueva Venta</Text>
  );
}

function SaleEmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <View className="flex-1 justify-center items-center gap-4 py-20">
      <Text className="text-gray-400 dark:text-gray-500 text-base text-center">
        No hay productos agregados
      </Text>
      <Pressable
        onPress={onAdd}
        className="px-8 py-3 bg-blue-500 rounded-2xl items-center"
        style={{ borderCurve: 'continuous' }}
      >
        <Text className="text-white font-semibold">Agregar</Text>
      </Pressable>
    </View>
  );
}

type ActionBarProps = {
  hasItems: boolean;
  isSaleValid: boolean;
  isPending: boolean;
  onCancel: () => void;
  onSell: () => void;
};

function ActionBar({ hasItems, isSaleValid, isPending, onCancel, onSell }: ActionBarProps) {
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
        onPress={onCancel}
        className="flex-1 py-4 bg-gray-100 dark:bg-zinc-800 rounded-2xl items-center"
        style={{ borderCurve: 'continuous' }}
      >
        <Text className="font-semibold text-gray-700 dark:text-gray-300">Cancelar</Text>
      </Pressable>

      {hasItems ? (
        <Pressable
          onPress={onSell}
          disabled={!isSaleValid || isPending}
          className={`flex-1 py-4 rounded-2xl items-center ${
            isSaleValid && !isPending ? 'bg-blue-500' : 'bg-gray-200 dark:bg-zinc-700'
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

export default function NewSaleScreen() {
  const { replace } = useRouter();
  const { top } = useSafeAreaInsets();
  const { items, clearSale } = useSaleStore();

  const { mutate: registerSale, isPending, error } = useRegisterSale();

  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const {
    openScanner,
    handleGrantPermission,
    showPermissionModal,
    setShowPermissionModal,
    isDenied,
  } = useCameraScanner('sale');

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items]
  );

  const hasItems = items.length > 0;

  const handleCancel = () => {
    if (hasItems) {
      setShowCancelModal(true);
    } else {
      replace(Routes.home);
    }
  };

  const handleConfirmCancel = () => {
    clearSale();
    setShowCancelModal(false);
    replace(Routes.home);
  };

  const handleRegister = (method: PaymentMethodType) => {
    registerSale({
      payment_method_id: method.id,
      total_amount: total.toFixed(2),
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      total,
      paymentMethodName: method.name,
    });
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-black">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={SaleListHeader}
        ListFooterComponent={
          hasItems ? (
            <View className="mt-4 gap-3">
              <SaleSummary total={total} itemCount={items.length} />
              {error ? (
                <View className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-xl px-4 py-3">
                  <Text className="text-red-700 dark:text-red-400 text-sm text-center">
                    Error al registrar la venta. Intenta de nuevo.
                  </Text>
                </View>
              ) : null}
            </View>
          ) : null
        }
        ListEmptyComponent={<SaleEmptyState onAdd={openScanner} />}
        contentContainerStyle={{ padding: 20, paddingTop: top + 20, paddingBottom: 32, flexGrow: 1 }}
        ItemSeparatorComponent={ItemSeparator}
      />

      <ActionBar
        hasItems={hasItems}
        isSaleValid={hasItems}
        isPending={isPending}
        onCancel={handleCancel}
        onSell={() => setShowPaymentModal(true)}
      />

      <CancelSaleModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />

      <PaymentModal
        visible={showPaymentModal}
        total={total}
        isPending={isPending}
        onClose={() => setShowPaymentModal(false)}
        onRegister={handleRegister}
      />

      <CameraPermissionModal
        visible={showPermissionModal}
        isDenied={isDenied}
        onClose={() => setShowPermissionModal(false)}
        onGrant={handleGrantPermission}
      />
    </View>
  );
}
