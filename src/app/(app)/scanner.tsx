import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameOutput,
} from 'react-native-vision-camera';
import { useBarcodeScanner } from 'react-native-vision-camera-barcode-scanner';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProductModal } from '@/components/product/ProductModal';
import { CancelSaleModal } from '@/components/sale/CancelSaleModal';
import { ScannerOverlay } from '@/components/scanner/ScannerOverlay';
import { ScannerSaleControls } from '@/components/scanner/ScannerSaleControls';
import { BackIcon } from '@/components/ui/icons';
import { Routes } from '@/constants/routes';
import { useProduct } from '@/hooks/useProduct';
import { useSaleStore } from '@/store/saleStore';

export default function ScannerScreen() {
  const { back, replace } = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSaleMode = mode === 'sale';

  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const { items, addProduct, clearSale } = useSaleStore();
  const hasItems = items.length > 0;

  const [barcode, setBarcode] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const isScanning = useSharedValue(false);

  useFocusEffect(
    useCallback(() => {
      setBarcode(null);
      isScanning.set(false);
    }, [isScanning])
  );

  const handleBarcode = useCallback((code: string) => {
    setBarcode(code);
  }, []);

  const barcodeScanner = useBarcodeScanner({ barcodeFormats: ['all-formats'] });

  const frameOutput = useFrameOutput({
    pixelFormat: 'yuv',
    onFrame(frame) {
      'worklet';
      if (isScanning.get()) {
        frame.dispose();
        return;
      }
      const barcodes = barcodeScanner.scanCodes(frame);
      frame.dispose();
      if (barcodes.length > 0) {
        const value = barcodes[0].displayValue ?? barcodes[0].rawValue;
        if (value) {
          isScanning.set(true);
          runOnJS(handleBarcode)(value);
        }
      }
    },
  });

  const { data: product, isLoading, isError } = useProduct(barcode);

  const handleCloseModal = useCallback(() => {
    setBarcode(null);
    isScanning.set(false);
  }, [isScanning]);

  useEffect(() => {
    if (!isError) return;
    const timer = setTimeout(() => {
      setBarcode(null);
      isScanning.set(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isError, isScanning]);

  useEffect(() => {
    if (!isSaleMode || !product) return;
    addProduct(product);
    handleCloseModal();
  }, [product, isSaleMode, addProduct, handleCloseModal]);

  const handleBackPress = () => {
    if (isSaleMode && hasItems) {
      setShowCancelModal(true);
    } else {
      back();
    }
  };

  const handleConfirmCancel = () => {
    clearSale();
    setShowCancelModal(false);
    replace(Routes.home);
  };

  if (!device || !hasPermission) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center gap-3">
        <ActivityIndicator color="#fff" size="large" />
        <Text className="text-white/70">Iniciando cámara…</Text>
      </View>
    );
  }

  const modalVisible = !isSaleMode && !!product;
  const errorMessage = isError ? 'Producto no encontrado' : undefined;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={!modalVisible}
        outputs={[frameOutput]}
      />

      <ScannerOverlay isLoading={!!isLoading && barcode !== null} errorMessage={errorMessage} />

      <Pressable
        onPress={handleBackPress}
        className="absolute top-12 left-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
      >
        <BackIcon size={22} color="#fff" />
      </Pressable>

      {isSaleMode ? (
        <ScannerSaleControls
          itemCount={items.length}
          onCancel={() => setShowCancelModal(true)}
          onReset={handleCloseModal}
          onGoToCart={back}
        />
      ) : null}

      <ProductModal product={product ?? null} visible={modalVisible} onClose={handleCloseModal} />

      <CancelSaleModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}
