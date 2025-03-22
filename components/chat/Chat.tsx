import * as Ably from 'ably';
import { AblyProvider, ChannelProvider } from 'ably/react';
import { Message, UserInfo } from './chat.interfaces';
import { ChatBox } from './ChatBox';

interface ChatProps {
  user: UserInfo;
  messages: Message[];
}

export default function Chat({ user, messages }: ChatProps) {
  const client = new Ably.Realtime({ authUrl: '/api' });

  return (
    <AblyProvider client={client}>
      <ChannelProvider channelName="chat-demo">
        <ChatBox user={user} existingMessages={messages} />
      </ChannelProvider>
    </AblyProvider>
  );
}
