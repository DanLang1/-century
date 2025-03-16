import { UserInfo } from '@/components/chat/chat.interfaces';
import { ChatContainer } from '@/components/chat/ChatContainer';
import { Welcome } from '@/components/Welcome/Welcome';
import { createClient } from '@/utils/supabase/server';

export default async function HomePage() {
  const supabase = await createClient();

  let currUser: UserInfo = {
    username: 'xatRando',
    avatar: '/avatarIcons/303.png',
    id: '',
  };

  const { data } = await supabase.auth.getUser();

  if (data.user) {
    const { data: userInfo } = await supabase
      .from('profiles')
      .select('id,username, avatar, is_anon')
      .eq('id', data?.user.id);

    if (userInfo) {
      const { id, username, avatar, is_anon } = userInfo[0];
      currUser = {
        id,
        username,
        avatar,
        anonymous: is_anon,
      };
    }
  }

  return (
    <>
      <Welcome />

      <ChatContainer user={currUser} />
    </>
  );
}
