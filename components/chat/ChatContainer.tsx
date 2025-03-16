'use client';

import dynamic from 'next/dynamic';
import { UserInfo } from './chat.interfaces';

interface ChatContainerProps {
  user: UserInfo;
}

const Chat = dynamic(() => import('@/components/chat/Chat'), {
  ssr: false,
});

export function ChatContainer({ user }: ChatContainerProps) {
  return <Chat user={user} />;
}
