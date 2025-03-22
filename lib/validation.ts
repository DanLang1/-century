import { z } from 'zod';

export const signupSchema = z.object({
  username: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
  terms: z.boolean(),
  avatar: z
    .string({ required_error: 'Avatar is required' })
    .min(1, { message: 'Avatar is required' }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string(),
});

export const modalUserSelectSchema = z.object({
  username: z.string().min(2, { message: 'Name should have at least 2 letters' }),
  avatar: z
    .string({ required_error: 'Avatar is required' })
    .min(1, { message: 'Avatar is required' }),
});

export const emailPasswordSignupSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
});

export const confirmEmailSchema = z.object({
  passcode: z.string().min(6).max(6),
});

export const emailSchema = z.object({
  email: z.string().email({ message: 'Invalid Email' }),
});

export const passwordSchema = z.object({
  password: z.string().min(6, { message: 'Password should include at least 6 characters' }),
});

export const chatMessageSchema = z.object({
  message: z.string().max(500, { message: 'Azx please break this up into 2 messages' }),
});
