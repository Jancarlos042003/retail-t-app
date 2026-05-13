import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Linking, Pressable, StyleSheet, Text, View } from 'react-native';
import { runOnJS, useSharedValue } from 'react-native-reanimated';
import { Camera, useCameraDevice, useCameraPermission, useFrameOutput } from 'react-native-vision-camera';
import { useBarcodeScanner } from 'react-native-vision-camera-barcode-scanner';
import { useFocusEffect, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { ProductModal } from '@/components/product/ProductModal';
import { ScannerOverlay } from '@/components/scanner/ScannerOverlay';
import { BackIcon } from '@/components/ui/icons';
import { useProduct } from '@/hooks/useProduct';

export default function ScannerScreen() {
  const { back } = useRouter();
  const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  const [barcode, setBarcode] = useState<string | null>(null);
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
  const { scanCodes } = barcodeScanner;

  const frameOutput = useFrameOutput({
    onFrame(frame) {
      'worklet';
      if (isScanning.get()) {
        frame.dispose();
        return;
      }
      const barcodes = scanCodes(frame);
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

  useEffect(() => {
    if (!isError) return;
    const timer = setTimeout(() => {
      setBarcode(null);
      isScanning.set(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [isError, isScanning]);

  const handleCloseModal = useCallback(() => {
    setBarcode(null);
    isScanning.set(false);
  }, [isScanning]);

  if (!hasPermission) {
    const denied = !canRequestPermission;
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center gap-4 px-8">
        <Text className="text-white text-lg font-semibold text-center">
          Se necesita permiso de cámara
        </Text>
        {denied ? (
          <Text className="text-white/60 text-sm text-center">
            El permiso fue denegado. Actívalo desde la configuración del sistema.
          </Text>
        ) : null}
        <Pressable
          onPress={denied ? () => Linking.openSettings() : requestPermission}
          className="bg-blue-500 px-8 py-4 rounded-2xl"
          style={{ borderCurve: 'continuous' }}
        >
          <Text className="text-white font-semibold">
            {denied ? 'Abrir configuración' : 'Conceder permiso'}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!device) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center gap-3">
        <ActivityIndicator color="#fff" size="large" />
        <Text className="text-white/70">Iniciando cámara…</Text>
      </View>
    );
  }

  const modalVisible = !!product;
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
        onPress={back}
        className="absolute top-12 left-4 w-10 h-10 bg-black/40 rounded-full items-center justify-center"
      >
        <BackIcon size={22} color="#fff" />
      </Pressable>

      <ProductModal product={product ?? null} visible={modalVisible} onClose={handleCloseModal} />
    </View>
  );
}
