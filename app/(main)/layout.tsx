import '@mantine/core/styles.css';

import { AppShellLayout } from '@/components/AppShellLayout/AppShellLayout';

export default function MainLayout({ children }: { children: any }) {
  return <AppShellLayout>{children}</AppShellLayout>;
}
