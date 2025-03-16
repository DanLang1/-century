'use client';

import { useState } from 'react';
import {
  Button,
  Checkbox,
  Group,
  Paper,
  PasswordInput,
  PinInput,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { changeEmail, confirmEmail, updatePassword } from '@/app/login/registerTempUser/actions';
import { confirmEmailSchema, emailPasswordSignupSchema } from '@/lib/validation';
import { UserInfo } from './chat/chat.interfaces';

interface UpdateUserFormProps {
  user: UserInfo;
}
export function UpdateUserForm({ user }: UpdateUserFormProps) {
  const [active, setActive] = useState(0);
  const nextStep = () => setActive((current) => (current < 3 ? current + 1 : current));
  const prevStep = () => setActive((current) => (current > 0 ? current - 1 : current));
  const [updateEmailFormValues, setUpdateEmailFormValues] = useState<
    typeof updateEmailForm.values | null
  >(null);
  const updateEmailForm = useForm({
    initialValues: {
      email: '',
      password: '',
    },

    validate: zodResolver(emailPasswordSignupSchema),
  });

  const confirmEmailForm = useForm({
    initialValues: {
      passcode: '',
    },
    validate: zodResolver(confirmEmailSchema),
  });

  const handleUpdateEmail = async (values: typeof updateEmailForm.values) => {
    setUpdateEmailFormValues(values);
    const formData = new FormData();
    formData.append('email', values.email);
    formData.append('password', values.password);

    const result = await changeEmail(formData);
    if (result?.error) {
      notifications.show({
        color: 'red',
        title: 'Something went wrong :(',
        message: result.error.message,
        position: 'top-center',
      });
      return;
    }

    nextStep();
  };

  const handleConfirmEmail = async (values: typeof confirmEmailForm.values) => {
    const formData = new FormData();
    formData.append('email', updateEmailFormValues?.email ?? '');
    formData.append('passcode', values.passcode);

    const session = await confirmEmail(formData);

    if (session) {
      const formData = new FormData();
      formData.append('password', updateEmailFormValues?.password ?? '');
      await updatePassword(formData);
    }
  };

  return (
    <>
      <Stepper active={active} onStepClick={setActive}>
        <Stepper.Step label="First step" description="Setup Email" allowStepSelect={false}>
          <Paper radius="md" p="xl" withBorder>
            <Text size="lg" fw={500} pb="md">
              Join the team of the Century!
            </Text>

            <form
              onSubmit={updateEmailForm.onSubmit((values) => {
                handleUpdateEmail(values);
              })}
            >
              <Stack>
                <TextInput
                  required
                  label="Email"
                  placeholder="vampiruuu@century.com"
                  value={updateEmailForm.values.email}
                  onChange={(event) =>
                    updateEmailForm.setFieldValue('email', event.currentTarget.value)
                  }
                  error={updateEmailForm.errors.email && 'Invalid email'}
                  radius="md"
                />
                <PasswordInput
                  required
                  label="Password"
                  placeholder="sowsuckseggs"
                  value={updateEmailForm.values.password}
                  onChange={(event) =>
                    updateEmailForm.setFieldValue('password', event.currentTarget.value)
                  }
                  error={
                    updateEmailForm.errors.password &&
                    'Password should include at least 6 characters'
                  }
                  radius="md"
                />
              </Stack>

              <Group justify="space-between" mt="xl">
                <Button type="submit" radius="xl">
                  Next
                </Button>
              </Group>
            </form>
          </Paper>
        </Stepper.Step>
        <Stepper.Step label="Second step" description="Verify email" allowStepSelect={false}>
          <Paper radius="md" p="xl" withBorder>
            <Text size="lg" fw={500} pb="md">
              Enter 6 digit code sent to your email
            </Text>

            <form
              onSubmit={confirmEmailForm.onSubmit((values) => {
                handleConfirmEmail(values);
              })}
            >
              <Stack>
                <PinInput
                  length={6}
                  type="number"
                  key={confirmEmailForm.key('passcode')}
                  {...confirmEmailForm.getInputProps('passcode')}
                  error={confirmEmailForm.errors.passcode ? true : false}
                />
              </Stack>

              <Group justify="space-between" mt="xl">
                <Button type="submit" radius="xl">
                  Next
                </Button>
              </Group>
            </form>
          </Paper>
        </Stepper.Step>
      </Stepper>
    </>
  );
}
