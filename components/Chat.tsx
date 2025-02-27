'use client';

import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { ChatBoxAbly } from './ChatBoxAbly';

export default function Chat() {
  const client = new Ably.Realtime({ authUrl: '/api' });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat-demo">
        <ChatBoxAbly />
      </ChannelProvider>
    </AblyProvider>
  );
}
