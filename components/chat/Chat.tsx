import { redirect } from 'next/navigation';
import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { createClient } from '@/utils/supabase/server';
import { UserInfo } from './chat.interfaces';
import { ChatBox } from './ChatBox';

interface ChatProps {
  user: UserInfo;
}

export default function Chat({ user }: ChatProps) {
  const client = new Ably.Realtime({ authUrl: '/api' });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat-demo">
        <ChatBox user={user} />
      </ChannelProvider>
    </AblyProvider>
  );
}
