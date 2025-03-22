'use client';

import dynamic from 'next/dynamic';
import { Message, UserInfo } from './chat.interfaces';

interface ChatContainerProps {
  user: UserInfo;
  messages: Message[];
}

const Chat = dynamic(() => import('@/components/chat/Chat'), {
  ssr: false,
});

export function ChatContainer({ user, messages }: ChatContainerProps) {
  return <Chat user={user} messages={messages} />;
}
