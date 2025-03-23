import '@mantine/core/styles.css';

import ProfileToggleContainer from '@/components/AppShellLayout/ProfileToggleContainer';

export default function MainLayout({ children }: { children: any }) {
  return <ProfileToggleContainer>{children}</ProfileToggleContainer>;
}
