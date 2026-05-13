import { Redirect } from 'expo-router';

import { Routes } from '@/constants/routes';

export default function Index() {
  return <Redirect href={Routes.home} />;
}
