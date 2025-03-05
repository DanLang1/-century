import { redirect, useRouter } from 'next/navigation';
import { IconUser } from '@tabler/icons-react';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AvatarSelector } from './AvatarSelector';
import { UserForm } from './chat.interfaces';

export interface UserSelectModalProps {
  modalOpened: boolean;
  toggleModal: () => void;
  form: UseFormReturnType<UserForm>;
}

export function UserSelectModal({ modalOpened, toggleModal, form }: UserSelectModalProps) {
  const router = useRouter();
  const navigateToAuthForm = () => {
    router.push('/login?type=register');
  };
  return (
    <Modal opened={modalOpened} onClose={toggleModal} title="Select User Icon and Username">
      <Stack>
        <AvatarSelector form={form} />
        <TextInput
          pt="sm"
          placeholder="username"
          leftSection={<IconUser />}
          maxLength={15}
          key={form.key('user')}
          {...form.getInputProps('user')}
          form="userForm"
        />
        <Button form="userForm" type="submit" disabled={!form.isValid()}>
          Continue
        </Button>

        <Button variant="transparent" size="xs" type="button" onClick={navigateToAuthForm}>
          Want to create an account instead?
        </Button>
      </Stack>
    </Modal>
  );
}
