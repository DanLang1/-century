import { IconUser } from '@tabler/icons-react';
import { Button, Modal, Stack, TextInput } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { AvatarSelector } from './AvatarSelector';
import { User } from './ChatBoxAbly';

export interface UserSelectModalProps {
  modalOpened: boolean;
  toggleModal: () => void;
  form: UseFormReturnType<User>;
}

export function UserSelectModal({ modalOpened, toggleModal, form }: UserSelectModalProps) {
  return (
    <Modal opened={modalOpened} onClose={toggleModal} title="Select User Icon and Username">
      <Stack>
        <AvatarSelector form={form} />

        <TextInput
          pt="sm"
          placeholder="username"
          leftSection={<IconUser />}
          required
          maxLength={15}
          key={form.key('user')}
          {...form.getInputProps('user')}
          form="userForm"
        />
        <Button form="userForm" type="submit" disabled={!form.isValid()}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
}
