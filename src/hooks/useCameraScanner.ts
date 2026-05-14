import { useState } from 'react';
import { useRouter } from 'expo-router';
import { useCameraPermission } from 'react-native-vision-camera';

import { Routes } from '@/constants/routes';

type ScannerMode = 'search' | 'sale';

export function useCameraScanner(mode: ScannerMode = 'search') {
  const { push } = useRouter();
  const { hasPermission, canRequestPermission, requestPermission } = useCameraPermission();
  const [showPermissionModal, setShowPermissionModal] = useState(false);

  const openScanner = () => {
    if (hasPermission) {
      push(mode === 'sale' ? `${Routes.scanner}?mode=sale` : Routes.scanner);
    } else {
      setShowPermissionModal(true);
    }
  };

  const handleGrantPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      setShowPermissionModal(false);
      push(mode === 'sale' ? `${Routes.scanner}?mode=sale` : Routes.scanner);
    }
  };

  return {
    openScanner,
    handleGrantPermission,
    showPermissionModal,
    setShowPermissionModal,
    isDenied: !canRequestPermission,
  };
}
