import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { UserInfo } from '@/components/chat/chat.interfaces';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { UpdateUserForm } from '@/components/UpdateUserForm';
import { Welcome } from '@/components/Welcome/Welcome';
import { createClient } from '@/utils/supabase/server';

export default async function ConvertAnonToFullUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    console.error(error);
    redirect('/login');
  }

  const { data: userInfo } = await supabase
    .from('profiles')
    .select('id,username, avatar, is_anon')
    .eq('id', data?.user.id);

  const user = userInfo?.[0] ?? null;
  if (!user) {
    redirect('/login');
  }
  return (
    <Suspense>
      <UpdateUserForm user={user} />
    </Suspense>
  );
}
