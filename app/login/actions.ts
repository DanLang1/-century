'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { loginSchema, signupSchema } from '@/lib/validation';
import { createClient } from '@/utils/supabase/server';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const parsedData = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  const request = {
    email: parsedData.data.email,
    password: parsedData.data.password,
  };

  const { error } = await supabase.auth.signInWithPassword(request);

  // todo: better error handling
  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const parsedData = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
    terms: formData.get('terms') === 'true',
    avatar: formData.get('avatar'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  // check if username already exists
  const { data: username } = await supabase
    .from('profiles')
    .select('username, is_anon')
    .eq('is_anon', false)
    .eq('username', parsedData.data.username);

  if (username && username.length > 0) {
    return {
      errors: {
        username: [`A permanent user (probably sow) already took this username :(`],
      },
    };
  }

  const request = {
    email: parsedData.data.email,
    password: parsedData.data.password,
    options: {
      data: {
        username: parsedData.data.username,
        terms: parsedData.data.terms,
        avatar: parsedData.data.avatar,
      },
    },
  };

  const { error } = await supabase.auth.signUp(request);

  // todo: better error handling
  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
