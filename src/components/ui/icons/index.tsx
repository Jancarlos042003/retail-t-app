import { Ionicons } from '@expo/vector-icons';

type IconProps = {
  size?: number;
  color?: string;
};

export function ScanIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="scan-outline" size={size} color={color} />;
}

export function CartIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="cart-outline" size={size} color={color} />;
}

export function BackIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="chevron-back" size={size} color={color} />;
}

export function PlusIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="add" size={size} color={color} />;
}

export function MinusIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="remove" size={size} color={color} />;
}

export function TrashIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="trash-outline" size={size} color={color} />;
}

export function CheckCircleIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="checkmark-circle" size={size} color={color} />;
}

export function CloseIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="close" size={size} color={color} />;
}

export function AlertIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="alert-circle-outline" size={size} color={color} />;
}

export function RefreshIcon({ size = 24, color = '#000' }: IconProps) {
  return <Ionicons name="refresh-outline" size={size} color={color} />;
}
