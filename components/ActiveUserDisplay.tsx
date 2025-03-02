import {
  Avatar,
  Drawer,
  Grid,
  Group,
  ScrollArea,
  Stack,
  Text,
  UnstyledButton,
} from '@mantine/core';
import { UserInfo } from './ChatBox';

interface ActiveUserDisplayProps {
  opened: boolean;
  toggle: () => void;
  users: UserInfo[];
  openUserModal: () => void;
  currUserId: string;
}
export function ActiveUserDisplay({
  opened,
  toggle,
  users,
  openUserModal,
  currUserId,
}: ActiveUserDisplayProps) {
  const onClickMobile = () => {
    toggle();
    openUserModal();
  };
  return (
    <>
      {/* Small screens open a drawer to show users */}
      <Drawer
        offset={8}
        radius="md"
        opened={opened}
        onClose={toggle}
        title="Users"
        position="right"
      >
        {users.map((user, index) => (
          <Stack key={index} mt="sm">
            {user.connectionId === currUserId ? (
              <UnstyledButton onClick={onClickMobile}>
                <Group align="center" gap="sm">
                  <Avatar radius="xl" size="sm" src={user.avatar} />
                  <Text>{user.username}</Text>
                </Group>
              </UnstyledButton>
            ) : (
              <Group align="center" gap="sm">
                <Avatar radius="xl" size="sm" src={user.avatar} />
                <Text>{user.username}</Text>
              </Group>
            )}
          </Stack>
        ))}
      </Drawer>

      {/* Large screen just show it on the side */}
      <Grid.Col span={3} visibleFrom="sm">
        <ScrollArea h="50vh" type="always" p="md" bg="var(--mantine-color-gray-light)" bd="rounded">
          <Stack>
            {users.map((user, index) =>
              user.connectionId === currUserId ? (
                <UnstyledButton key={index} onClick={openUserModal}>
                  <Group align="center">
                    <Avatar radius="xl" size="sm" src={user.avatar} />
                    <Text>{user.username}</Text>
                  </Group>
                </UnstyledButton>
              ) : (
                <Group key={index} align="center">
                  <Avatar radius="xl" size="sm" src={user.avatar} />
                  <Text>{user.username}</Text>
                </Group>
              )
            )}
          </Stack>
        </ScrollArea>
      </Grid.Col>
    </>
  );
}
