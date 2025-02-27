import { useEffect, useRef, useState } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
import { Message } from '@/components/ChatBox';

type UseCreateChatRoomProps = {
  onMessage: (message: Message) => void;
};

export const useCreateChatRoom = ({ onMessage }: UseCreateChatRoomProps) => {
  const channel = useRef<RealtimeChannel | null>(null);
  useEffect(() => {
    if (!channel.current) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      channel.current = client.channel('chat-room', {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      channel.current
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          onMessage(payload.message);
        })
        .subscribe();
    }

    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, [onMessage]);
};
