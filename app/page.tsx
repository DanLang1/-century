import { AppShellLayout } from '@/components/AppShellLayout/AppShellLayout';
import { ChatBox } from '@/components/ChatBox';
import { Welcome } from '@/components/Welcome/Welcome';

export default function HomePage() {
  return (
    <>
      <Welcome />
      <ChatBox />
    </>
  );
}
