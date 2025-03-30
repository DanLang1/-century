import { Avatar, Drawer, Group, Stack, Text, UnstyledButton } from '@mantine/core';
import { UserInfo } from './chat.interfaces';

interface ActiveUserDisplayMobileProps {
  opened: boolean;
  toggle: () => void;
  users: UserInfo[];
  openUserModal: () => void;
  currUserId: string;
}
export function ActiveUserDisplayMobile({
  opened,
  toggle,
  users,
  openUserModal,
  currUserId,
}: ActiveUserDisplayMobileProps) {
  const onClickMobile = () => {
    toggle();
    openUserModal();
  };

  return (
    <Drawer offset={8} radius="md" opened={opened} onClose={toggle} title="Users" position="right">
      {users.map((user, index) => (
        <Stack key={index} mt="sm">
          {user.id === currUserId ? (
            <UnstyledButton onClick={onClickMobile}>
              <Group align="center" gap="sm">
                <Avatar radius="xl" size="md" src={user.avatar} />
                <Text size="md" c={!(user.anonymous ?? true) ? 'blue' : '#089712'}>
                  {user.username}
                </Text>
              </Group>
            </UnstyledButton>
          ) : (
            <Group align="center" gap="sm">
              <Avatar radius="xl" size="md" src={user.avatar} />
              <Text size="md" c={!(user.anonymous ?? true) ? 'blue' : '#089712'}>
                {user.username}
              </Text>
            </Group>
          )}
        </Stack>
      ))}
    </Drawer>
  );
}
