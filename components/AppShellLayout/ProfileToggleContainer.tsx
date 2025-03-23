'use server';

import { createClient } from '@/utils/supabase/server';
import { AppShellLayout } from './AppShellLayout';

export default async function ProfileToggleContainer({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  return <AppShellLayout user={data.user}>{children} </AppShellLayout>;
}
