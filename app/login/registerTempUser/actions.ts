'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  confirmEmailSchema,
  emailPasswordSignupSchema,
  emailSchema,
  passwordSchema,
} from '@/lib/validation';
import { createClient } from '@/utils/supabase/server';

export async function changeEmail(formData: FormData) {
  const supabase = await createClient();

  const parsedData = emailPasswordSignupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  const { error } = await supabase.auth.updateUser({
    email: parsedData.data.email,
  });

  if (error) {
    console.log(error);
    return { error: error, message: 'An error occurred during signup' };
  }
}

export async function confirmEmail(formData: FormData) {
  const supabase = await createClient();
  const parsedEmail = emailSchema.safeParse({
    email: formData.get('email'),
  });

  if (!parsedEmail.success) {
    const fieldErrors = parsedEmail.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }
  const parsedPasscode = confirmEmailSchema.safeParse({
    passcode: formData.get('passcode'),
  });
  if (!parsedPasscode.success) {
    const fieldErrors = parsedPasscode.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }

  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email: parsedEmail.data.email,
    token: parsedPasscode.data.passcode,
    type: 'email_change',
  });

  // todo: better error handling
  if (error) {
    console.log(error);
    redirect('/error');
  }
  return session;
}

export async function updatePassword(formData: FormData) {
  const supabase = await createClient();
  const parsedData = passwordSchema.safeParse({
    password: formData.get('password'),
  });

  if (!parsedData.success) {
    const fieldErrors = parsedData.error.flatten().fieldErrors;
    console.error('Validation errors:', fieldErrors);
    return { errors: fieldErrors, message: 'Validation failed' };
  }
  const { data, error } = await supabase.auth.updateUser({ password: parsedData.data.password });
  if (error) {
    console.log(error);
    redirect('/error');
  }

  // if update user was successful, then update the profiles table so that user is no longer anonymous
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ is_anon: false })
    .eq('id', data.user.id);

  // todo: better error handling
  if (updateError) {
    console.log(error);
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/');
}
