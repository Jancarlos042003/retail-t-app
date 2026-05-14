import { useMemo, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PaymentModal } from '@/components/sale/PaymentModal';
import { SaleActionBar } from '@/components/sale/SaleActionBar';
import { SaleEmptyState } from '@/components/sale/SaleEmptyState';
import { SaleItemCard } from '@/components/sale/SaleItemCard';
import { SaleSummary } from '@/components/sale/SaleSummary';
import { CameraPermissionModal } from '@/components/scanner/CameraPermissionModal';
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

export default function NewSaleScreen() {
  const { top } = useSafeAreaInsets();
  const { items } = useSaleStore();

  const { mutate: registerSale, isPending, error } = useRegisterSale();

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
        ListEmptyComponent={<SaleEmptyState />}
        contentContainerStyle={{ padding: 20, paddingTop: top + 20, paddingBottom: 32, flexGrow: 1 }}
        ItemSeparatorComponent={ItemSeparator}
      />

      <SaleActionBar
        hasItems={hasItems}
        isSaleValid={hasItems}
        isPending={isPending}
        onAdd={openScanner}
        onSell={() => setShowPaymentModal(true)}
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
