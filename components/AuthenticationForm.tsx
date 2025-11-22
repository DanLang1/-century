'use client';

import { useSearchParams } from 'next/navigation';
import {
  Anchor,
  Button,
  Checkbox,
  Group,
  LoadingOverlay,
  Paper,
  PaperProps,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { upperFirst, useToggle } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { login, signup } from '@/app/login/actions';
import { loginSchema, signupSchema } from '@/lib/validation';
import { AvatarSelector } from './chat/AvatarSelector';

export function AuthenticationForm(props: PaperProps) {
  const searchParams = useSearchParams();
  const typeFromUrl = searchParams.get('type') || 'login';

  const [type, toggle] = useToggle([typeFromUrl, typeFromUrl === 'login' ? 'register' : 'login']);
  const form = useForm({
    initialValues: {
      email: '',
      username: '',
      password: '',
      terms: true,
      avatar: '',
    },

    validate: type === 'register' ? zodResolver(signupSchema) : zodResolver(loginSchema),
  });

  const handleSubmit = async (values: typeof form.values) => {
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    if (type === 'register') {
      formData.append('username', values.username);
      formData.append('terms', values.terms.toString());
      formData.append('avatar', values.avatar);
      const { error } = await signup(formData);
      notifications.show({
        color: 'red',
        title: 'Something went wrong :(',
        message: error?.message,
        position: 'top-center',
        autoClose: false,
      });
    } else if (type === 'login') {
      const { errors } = await login(formData);
      form.setErrors(errors);
    }
  };

  return (
    <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500} pb="md">
        {type === 'register'
          ? 'Join the team of the Century!'
          : 'Login to the team of the Century!'}
      </Text>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {type === 'register' && (
            <TextInput
              required
              label="Username"
              placeholder="Explodedcookie"
              value={form.values.username}
              onChange={(event) => form.setFieldValue('username', event.currentTarget.value)}
              error={form.errors.username}
              radius="md"
            />
          )}

          {type === 'register' && (
            <Stack gap="1">
              <Text size="sm" fw={500}>
                Select an Avatar <span style={{ color: 'var(--mantine-color-error)' }}>*</span>
              </Text>
              <AvatarSelector form={form} />
              {form.errors.avatar && (
                <Text c="var(--mantine-color-error)" size="xs">
                  {form.errors.avatar}
                </Text>
              )}
            </Stack>
          )}

          <TextInput
            required
            label="Email"
            placeholder="vampiruuu@century.com"
            value={form.values.email}
            onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
            error={form.errors.email}
            radius="md"
          />

          <PasswordInput
            required
            label="Password"
            placeholder="sowsuckseggs"
            value={form.values.password}
            onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
            error={form.errors.password && 'Password should include at least 6 characters'}
            radius="md"
          />
          {type === 'register' && (
            <Checkbox
              label="I agree to retire to a mango farm with Rudston by 2050"
              checked={form.values.terms}
              onChange={(event) => form.setFieldValue('terms', event.currentTarget.checked)}
            />
          )}
        </Stack>

        <Group justify="space-between" mt="xl">
          <Anchor component="button" type="button" c="dimmed" onClick={() => toggle()} size="xs">
            {type === 'register'
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </Anchor>
          <Button type="submit" radius="xl" loading={form.submitting}>
            {upperFirst(type)}
          </Button>
        </Group>
      </form>
    </Paper>
  );
}
