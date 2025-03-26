import { redirect } from 'next/navigation';
import { Center } from '@mantine/core';
import { createClient } from '@/utils/supabase/server';

export default async function PrivatePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    redirect('/login');
  }

  return (
    <Center>
      <p>Hello {data.user.email}</p>
    </Center>
  );
}
