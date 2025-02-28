import { IconUser } from '@tabler/icons-react';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Drawer,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { AvatarSelector } from './AvatarSelector';

export interface UserSelectModalProps {
  modalOpened: boolean;
  toggleModal: () => void;
  avatar: string;
  setAvatar: (val: string) => void;
  user: string;
  setUser: (val: string) => void;
  handleContinue: () => void;
}

export function UserSelectModal({
  modalOpened,
  toggleModal,
  avatar,
  setAvatar,
  user,
  setUser,
  handleContinue,
}: UserSelectModalProps) {
  return (
    <Modal opened={modalOpened} onClose={toggleModal} title="Select User Icon and Username">
      <Stack>
        <AvatarSelector value={avatar} setValue={setAvatar} />

        <TextInput
          pt="sm"
          placeholder="username"
          leftSection={<IconUser />}
          value={user}
          onChange={(event) => setUser(event.currentTarget.value)}
          required
          maxLength={15}
        />
        <Button onClick={handleContinue} disabled={user === ''}>
          Continue
        </Button>
      </Stack>
    </Modal>
  );
}
