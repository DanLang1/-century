import { AppShellLayout } from '@/components/AppShellLayout/AppShellLayout';
import { ChatBox } from '@/components/ChatBox';

export default function HomePage() {
  return (
    <>
      <AppShellLayout showWelcome>
        <ChatBox />
      </AppShellLayout>
    </>
  );
}
