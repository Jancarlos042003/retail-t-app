import { Pressable, Text, View } from 'react-native';

export type ActionCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onPress: () => void;
};

export function ActionCard({ icon, title, description, color, onPress }: ActionCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-white dark:bg-zinc-900 rounded-3xl p-5 flex-row items-center gap-4 active:opacity-80"
      style={{
        borderCurve: 'continuous',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      }}
    >
      <View className={`w-16 h-16 ${color} rounded-2xl items-center justify-center`}>
        {icon}
      </View>
      <View className="flex-1 gap-1">
        <Text className="font-bold text-gray-900 dark:text-white text-base">{title}</Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm">{description}</Text>
      </View>
    </Pressable>
  );
}
