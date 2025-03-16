'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { modalUserSelectSchema } from '@/lib/validation';
import { createClient } from '@/utils/supabase/server';

// todo: better error handling

export async function updateUser(formData: FormData, id?: string) {
  if (!id) {
    throw new Error('No user id found');
  }
  const parsedData = modalUserSelectSchema.safeParse({
    username: formData.get('username'),
    avatar: formData.get('avatar'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  const supabase = await createClient();

  const body = {
    username: parsedData.data.username,
    avatar: parsedData.data.avatar,
  };

  // check if username already exists on accounts not it's own id
  const { data: username } = await supabase
    .from('profiles')
    .select('username,id')
    .eq('username', parsedData.data.username)
    .neq('id', id);

  if (username && username.length > 0) {
    return {
      errors: {
        username: [`Someone (probably sow) already took this username :(`],
      },
    };
  }

  // 3. Call the Supabase client and get the response
  const { data, error } = await supabase
    .from('profiles')
    .update(body)
    .eq('id', id)
    .select('*')
    .single();
  // 4. If there was an error, throw it
  if (error) throw error;
  if (!data) {
    throw new Error('No data returned from server');
  }

  revalidatePath('/');

  return { data };
}

export async function createAnonymousUser(formData: FormData) {
  const parsedData = modalUserSelectSchema.safeParse({
    username: formData.get('username'),
    avatar: formData.get('avatar'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  const supabase = await createClient();

  // check if username already exists
  const { data: username } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', parsedData.data.username);

  if (username && username.length > 0) {
    return {
      errors: {
        username: [`Someone (probably sow) already took this username :(`],
      },
    };
  }

  // 3. Call the Supabase client and get the response
  const { data, error } = await supabase.auth.signInAnonymously({
    options: {
      data: {
        username: parsedData.data.username,
        avatar: parsedData.data.avatar,
      },
    },
  });

  if (error) {
    redirect('/error');
  }

  let user = null;

  if (data.user) {
    const { data: userInfo } = await supabase
      .from('profiles')
      .select('id,username, avatar')
      .eq('id', data?.user.id);

    user = userInfo?.[0];
  }

  revalidatePath('/');

  return { user };
}
