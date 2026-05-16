import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as Haptics from 'expo-haptics';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Camera,
  type CameraRef,
  useCameraDevice,
  useCameraPermission,
} from "react-native-vision-camera";
import { useBarcodeScannerOutput } from "react-native-vision-camera-barcode-scanner";

import { ProductModal } from "@/components/product/ProductModal";
import { CancelSaleModal } from "@/components/sale/CancelSaleModal";
import { ScannerOverlay } from "@/components/scanner/ScannerOverlay";
import { ScannerControls } from "@/components/scanner/ScannerControls";
import { ScannerToast } from "@/components/scanner/ScannerToast";
import { BackIcon, FlashlightIcon, FlashlightOffIcon } from "@/components/ui/icons";
import { Routes } from "@/constants/routes";
import { useProduct } from "@/hooks/useProduct";
import { useSaleStore } from "@/store/saleStore";

const TOAST_DISMISS_MS = 2000;
const BARCODE_GONE_MS = 1500;

export default function ScannerScreen() {
  const { back, replace } = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [isSaleMode, setIsSaleMode] = useState(mode === "sale");

  const { hasPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const { items, addProduct, clearSale } = useSaleStore();
  const hasItems = items.length > 0;
  const total = useMemo(() => items.reduce((acc, item) => acc + item.subtotal, 0), [items]);

  const [barcode, setBarcode] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isScannerActive, setIsScannerActive] = useState(true);
  const [toastName, setToastName] = useState<string | null>(null);
  const [torchOn, setTorchOn] = useState(false);
  const cameraRef = useRef<CameraRef>(null);
  // Ref espejo para leer torchOn en handleCameraStarted sin closures desactualizadas.
  const torchOnRef = useRef(false);
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

  useEffect(() => {
    torchOnRef.current = torchOn;
  }, [torchOn]);

  // onStarted garantiza estado ACTIVE en CameraX: momento seguro para setTorchMode.
  // Restaura el torch si estaba activo antes de que la sesión anterior se cerrara.
  const handleCameraStarted = useCallback(() => {
    if (torchOnRef.current) {
      cameraRef.current?.controller?.setTorchMode('on');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setBarcode(null);
      setIsScannerActive(true);
      setToastName(null);
      // El torch se resetea al entrar en foco (cámara activa) y no en el
      // cleanup, para evitar cambiar torchMode mientras la sesión se cierra.
      setTorchOn(false);
      isHandlingScanRef.current = false;
      processingBarcodeRef.current = null;
      lastBarcodeSeenRef.current = 0;
      return () => {
        clearCooldown();
      };
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
    // try/catch: el haptics es opcional; falla en emuladores y dispositivos sin motor.
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(() => {});
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
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setToastName(product.name);
    setBarcode(null);
    cooldownTimerRef.current = setTimeout(() => {
      setToastName(null);
      cooldownTimerRef.current = null;
    }, TOAST_DISMISS_MS);
  }, [product, barcode, isSaleMode, addProduct]);

  const handleToggleMode = useCallback(() => {
    handleCloseModal();
    setIsSaleMode((prev) => !prev);
  }, [handleCloseModal]);

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
  const isCameraActive = isSaleMode ? true : isScannerActive && !modalVisible;
  const showHint = !isSaleMode || total === 0;

  return (
    <View className="flex-1 bg-black">
      <StatusBar style="light" />
      {/*
       * Sin prop torchMode: VisionCamera v5 llama setTorchMode al cambiar el
       * controller (inicio de sesión), antes de que CameraX esté en ACTIVE →
       * OperationCanceledException. El torch se controla imperativamente via cameraRef.
       */}
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isCameraActive}
        onStarted={handleCameraStarted}
        outputs={[scannerOutput]}
      />

      <ScannerOverlay
        isLoading={!!isLoading && barcode !== null}
        showHint={showHint}
      />

      <Pressable
        onPress={handleBackPress}
        className="absolute top-12 left-4 w-14 h-14 bg-black/50 rounded-full items-center justify-center"
      >
        <BackIcon size={26} color="#fff" />
      </Pressable>

      <View className="absolute top-12 left-0 right-0 items-center justify-center h-14 pointer-events-none">
        <View className="bg-black/50 rounded-full px-5 py-2">
          <Text className="text-white text-xs font-semibold tracking-widest uppercase">
            {isSaleMode ? 'Venta' : 'Búsqueda'}
          </Text>
        </View>
      </View>

      {device.hasTorch ? (
        <Pressable
          onPress={() => {
            if (!isCameraActive) return;
            const next = !torchOn;
            setTorchOn(next);
            // Control imperativo: cámara confirmada activa, no hay race condition.
            cameraRef.current?.controller?.setTorchMode(next ? 'on' : 'off');
          }}
          className="absolute top-12 right-4 w-14 h-14 bg-black/50 rounded-full items-center justify-center"
        >
          {torchOn
            ? <FlashlightIcon size={26} color="#FCD34D" />
            : <FlashlightOffIcon size={26} color="#fff" />
          }
        </Pressable>
      ) : null}

      <ScannerControls
        isSaleMode={isSaleMode}
        itemCount={items.length}
        total={total}
        onCancel={() => hasItems ? setShowCancelModal(true) : back()}
        onToggleMode={handleToggleMode}
        onGoToCart={mode === 'sale' ? back : () => replace(Routes.newSale)}
      />

      {toastName ? <ScannerToast variant="success" message={toastName} /> : null}
      {isError ? <ScannerToast variant="error" message="Producto no encontrado" /> : null}

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
