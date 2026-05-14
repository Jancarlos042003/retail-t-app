import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useBarcodeScannerOutput } from "react-native-vision-camera-barcode-scanner";

import { ProductModal } from "@/components/product/ProductModal";
import { CancelSaleModal } from "@/components/sale/CancelSaleModal";
import { ScannerOverlay } from "@/components/scanner/ScannerOverlay";
import { ScannerSaleControls } from "@/components/scanner/ScannerSaleControls";
import { ScannerToast } from "@/components/scanner/ScannerToast";
import { BackIcon } from "@/components/ui/icons";
import { Routes } from "@/constants/routes";
import { useProduct } from "@/hooks/useProduct";
import { useSaleStore } from "@/store/saleStore";

const TOAST_DISMISS_MS = 2000;
const BARCODE_GONE_MS = 1500;

export default function ScannerScreen() {
  const { back, replace } = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const isSaleMode = mode === "sale";

  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const { items, addProduct, clearSale } = useSaleStore();
  const hasItems = items.length > 0;

  const [barcode, setBarcode] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [toastName, setToastName] = useState<string | null>(null);
  const isHandlingScanRef = useRef(false);
  const processingBarcodeRef = useRef<string | null>(null);
  const lastBarcodeSeenRef = useRef<number>(0);
  const cooldownTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCooldown = useCallback(() => {
    if (cooldownTimerRef.current) {
      clearTimeout(cooldownTimerRef.current);
      cooldownTimerRef.current = null;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBarcode(null);
      setIsScannerActive(true);
      setToastName(null);
      isHandlingScanRef.current = false;
      processingBarcodeRef.current = null;
      lastBarcodeSeenRef.current = 0;
      return clearCooldown;
    }, [clearCooldown]),
  );

  const handleBarcode = useCallback(
    (code: string) => {
      setBarcode(code);
      if (!isSaleMode) {
        isHandlingScanRef.current = true;
        setIsScannerActive(false);
      }
    },
    [isSaleMode],
  );

  const scannerOutput = useBarcodeScannerOutput({
    barcodeFormats: ["all-formats"],
    onBarcodeScanned(barcodes) {
      const value = barcodes[0]?.displayValue ?? barcodes[0]?.rawValue;
      if (!value) return;

      if (isSaleMode) {
        const now = Date.now();
        if (processingBarcodeRef.current === value) {
          const elapsed = now - lastBarcodeSeenRef.current;
          lastBarcodeSeenRef.current = now;
          if (elapsed < BARCODE_GONE_MS) return;
        }
        processingBarcodeRef.current = value;
        lastBarcodeSeenRef.current = now;
      } else {
        if (isHandlingScanRef.current) return;
      }

      handleBarcode(value);
    },
    onError(error) {
      console.error("Barcode scanner error:", error);
    },
  });

  const { data: product, isLoading, isError } = useProduct(barcode);

  const handleCloseModal = useCallback(() => {
    clearCooldown();
    setBarcode(null);
    setIsScannerActive(true);
    setToastName(null);
    isHandlingScanRef.current = false;
    processingBarcodeRef.current = null;
    lastBarcodeSeenRef.current = 0;
  }, [clearCooldown]);

  useEffect(() => {
    if (!isError) return;
    const timer = setTimeout(() => {
      setBarcode(null);
      setIsScannerActive(true);
      isHandlingScanRef.current = false;
      processingBarcodeRef.current = null;
      lastBarcodeSeenRef.current = 0;
    }, 2000);
    return () => clearTimeout(timer);
  }, [isError]);

  useEffect(() => {
    if (!isSaleMode || !product || !barcode) return;
    if (product.barcode !== barcode) return;
    addProduct(product);
    setToastName(product.name);
    setBarcode(null);
    cooldownTimerRef.current = setTimeout(() => {
      setToastName(null);
      cooldownTimerRef.current = null;
    }, TOAST_DISMISS_MS);
  }, [product, barcode, isSaleMode, addProduct]);

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

  const modalVisible = !isSaleMode && !!product && product.barcode === barcode;
  const errorMessage = isError ? "Producto no encontrado" : undefined;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isSaleMode ? true : isScannerActive && !modalVisible}
        outputs={[scannerOutput]}
      />

      <ScannerOverlay
        isLoading={!!isLoading && barcode !== null}
        errorMessage={errorMessage}
      />

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

      {toastName ? <ScannerToast productName={toastName} /> : null}

      <ProductModal
        product={product ?? null}
        visible={modalVisible}
        onClose={handleCloseModal}
      />

      <CancelSaleModal
        visible={showCancelModal}
        onCancel={() => setShowCancelModal(false)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}
