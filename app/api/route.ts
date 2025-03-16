import { NextResponse } from 'next/server';
import Ably from 'ably';
import { createClient } from '@/utils/supabase/server';

// ensure Vercel doesn't cache the result of this route,
// as otherwise the token request data will eventually become outdated
// and we won't be able to authenticate on the client side
export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  // todo: probably don't need this otherwise can't let guests see chat
  // if (error || !data?.user) {
  //   return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  // }

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: data?.user?.id ?? 'next-chat-demo',
  });
  return Response.json(tokenRequestData);
}
