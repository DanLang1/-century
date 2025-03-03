'use client';

import dynamic from 'next/dynamic';
import { Welcome } from '@/components/Welcome/Welcome';

const Chat = dynamic(() => import('@/components/chat/Chat'), {
  ssr: false,
});

export default function HomePage() {
  return (
    <>
      <Welcome />
      <Chat />
    </>
  );
}
