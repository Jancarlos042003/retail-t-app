import { useMemo } from 'react';
import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PaymentSelector } from '@/components/sale/PaymentSelector';
import { SaleItemCard } from '@/components/sale/SaleItemCard';
import { SaleSummary } from '@/components/sale/SaleSummary';
import { Routes } from '@/constants/routes';
import { usePaymentMethods } from '@/hooks/usePaymentMethods';
import { useRegisterSale } from '@/hooks/useRegisterSale';
import { isCashMethod } from '@/lib/payment';
import { useSaleStore, SaleItem } from '@/store/saleStore';
import { PaymentMethodType } from '@/types';

function SaleListHeader() {
  return <Text className="text-2xl font-bold text-gray-900 mb-4">Nueva Venta</Text>;
}

function SaleListEmpty() {
  return (
    <View className="items-center py-16 gap-3">
      <Text className="text-gray-400 text-lg">El carrito está vacío</Text>
      <Text className="text-gray-400 text-sm text-center">
        Escanea productos para agregarlos a la venta
      </Text>
    </View>
  );
}

type SaleListFooterProps = {
  total: number;
  itemCount: number;
  loadingMethods: boolean;
  paymentMethods: PaymentMethodType[];
  paymentMethod: PaymentMethodType | null;
  amountPaid: number;
  change: number | null;
  error: Error | null;
  onSelect: (method: PaymentMethodType) => void;
  onAmountPaidChange: (amount: number) => void;
};

function SaleListFooter({
  total,
  itemCount,
  loadingMethods,
  paymentMethods,
  paymentMethod,
  amountPaid,
  change,
  error,
  onSelect,
  onAmountPaidChange,
}: SaleListFooterProps) {
  return (
    <View className="gap-3 mt-4">
      <SaleSummary total={total} itemCount={itemCount} />

      {loadingMethods ? (
        <ActivityIndicator className="py-4" />
      ) : (
        <PaymentSelector
          methods={paymentMethods}
          selected={paymentMethod}
          onSelect={onSelect}
          amountPaid={amountPaid}
          onAmountPaidChange={onAmountPaidChange}
          change={change}
        />
      )}

      {error ? (
        <View className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <Text className="text-red-700 text-sm text-center">
            Error al registrar la venta. Intenta de nuevo.
          </Text>
        </View>
      ) : null}
    </View>
  );
}

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

export default function NewSaleScreen() {
  const { replace } = useRouter();
  const { items, paymentMethod, amountPaid, setPaymentMethod, setAmountPaid, clearSale } =
    useSaleStore();

  const { data: paymentMethods, isLoading: loadingMethods } = usePaymentMethods();
  const { mutate: registerSale, isPending, error } = useRegisterSale();

  const total = useMemo(
    () => items.reduce((acc, item) => acc + item.subtotal, 0),
    [items]
  );

  const isCash = paymentMethod !== null && isCashMethod(paymentMethod);

  const change = useMemo(
    () => (isCash ? amountPaid - total : null),
    [isCash, amountPaid, total]
  );

  const isValid =
    items.length > 0 &&
    paymentMethod !== null &&
    (!isCash || amountPaid >= total);

  const handleCancelSale = () => {
    clearSale();
    replace(Routes.home);
  };

  const handleRegisterSale = () => {
    if (!isValid || !paymentMethod) return;
    registerSale({
      payment_method_id: paymentMethod.id,
      total_amount: total.toFixed(2),
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
      total,
      paymentMethodName: paymentMethod.name,
    });
  };

  const handleSelectMethod = (method: PaymentMethodType) => {
    setPaymentMethod(method);
    setAmountPaid(0);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={SaleListHeader}
        ListFooterComponent={
          <SaleListFooter
            total={total}
            itemCount={items.length}
            loadingMethods={!!loadingMethods}
            paymentMethods={paymentMethods ?? []}
            paymentMethod={paymentMethod}
            amountPaid={amountPaid}
            change={change}
            error={error}
            onSelect={handleSelectMethod}
            onAmountPaidChange={setAmountPaid}
          />
        }
        ListEmptyComponent={SaleListEmpty}
        contentContainerStyle={{ padding: 20, paddingBottom: 32 }}
        ItemSeparatorComponent={ItemSeparator}
      />

      <View
        className="flex-row gap-3 px-5 py-4 bg-white border-t border-gray-100"
        style={{ boxShadow: '0 -2px 12px rgba(0,0,0,0.06)' }}
      >
        <Pressable
          onPress={handleCancelSale}
          className="flex-1 py-4 bg-gray-100 rounded-2xl items-center"
          style={{ borderCurve: 'continuous' }}
        >
          <Text className="font-semibold text-gray-700">Cancelar</Text>
        </Pressable>

        <Pressable
          onPress={handleRegisterSale}
          disabled={!isValid || isPending}
          className={`flex-1 py-4 rounded-2xl items-center ${
            isValid && !isPending ? 'bg-blue-500' : 'bg-gray-200'
          }`}
          style={{ borderCurve: 'continuous' }}
        >
          {isPending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text
              className={`font-semibold ${isValid ? 'text-white' : 'text-gray-400'}`}
            >
              Realizar Venta
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
}
