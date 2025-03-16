import { redirect, useRouter } from 'next/navigation';
import { IconUser } from '@tabler/icons-react';
import { Button, Modal, Stack, Text, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AvatarSelector } from './AvatarSelector';
import { UserForm, UserInfo } from './chat.interfaces';

export interface UserSelectModalProps {
  modalOpened: boolean;
  toggleModal: () => void;
  form: UseFormReturnType<UserForm>;
  user: UserInfo;
}

export function UserSelectModal({ modalOpened, toggleModal, form, user }: UserSelectModalProps) {
  const router = useRouter();
  const navigateToAuthForm = () => {
    router.push('/login?type=register');
  };

  const navigateToConvertAnonToPermUser = () => {
    router.push('/login/registerTempUser');
  };
  const isAnon = user.anonymous;
  const isGuest = user.id === '';
  return (
    <Modal opened={modalOpened} onClose={toggleModal} title="Select User Icon and Username">
      <Stack>
        <AvatarSelector form={form} />
        {form.errors.avatar && (
          <Text c="var(--mantine-color-error)" size="xs">
            {form.errors.avatar}
          </Text>
        )}
        <TextInput
          pt="sm"
          placeholder="username"
          leftSection={<IconUser />}
          maxLength={15}
          key={form.key('username')}
          error={form.errors.username}
          {...form.getInputProps('username')}
          form="userForm"
        />
        <Button form="userForm" type="submit" disabled={!form.isValid()}>
          Continue
        </Button>

        {isGuest ? (
          <Button variant="transparent" size="xs" type="button" onClick={navigateToAuthForm}>
            Want to create an account instead?
          </Button>
        ) : null}
        {isAnon ? (
          <Button
            variant="transparent"
            size="xs"
            type="button"
            onClick={navigateToConvertAnonToPermUser}
          >
            Want to create a full account?
          </Button>
        ) : null}
      </Stack>
    </Modal>
  );
}
