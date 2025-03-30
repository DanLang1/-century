import { Avatar, Group, Paper, ScrollArea, Stack, Text, UnstyledButton } from '@mantine/core';
import { UserInfo } from './chat.interfaces';

interface ActiveUserDisplayProps {
  users: UserInfo[];
  openUserModal: () => void;
  currUserId: string;
}
export function ActiveUserDisplay({ users, openUserModal, currUserId }: ActiveUserDisplayProps) {
  return (
    <Paper
      visibleFrom="sm"
      w="11vw"
      shadow="md"
      bd="md"
      radius="md"
      p="sm"
      bg="var(--mantine-color-blue-light)"
      h="59vh"
    >
      <ScrollArea h="50vh" type="always" p="xs" bd="rounded" pr="0">
        <Stack>
          {users.map((user, index) =>
            user.id === currUserId ? (
              <UnstyledButton key={index} onClick={openUserModal}>
                <Group align="center">
                  <Avatar radius="xl" size="md" src={user.avatar} />
                  <Text size="md" c={!(user.anonymous ?? true) ? 'blue' : '#089712'}>
                    {user.username}
                  </Text>
                </Group>
              </UnstyledButton>
            ) : (
              <Group key={index} align="center">
                <Avatar radius="xl" size="md" src={user.avatar} />
                <Text size="md" c={!(user.anonymous ?? true) ? 'blue' : '#089712'}>
                  {user.username}
                </Text>
              </Group>
            )
          )}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}
