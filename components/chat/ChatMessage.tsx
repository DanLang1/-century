import Image from 'next/image';
import { Avatar, Group, HoverCard, Indicator, Paper, Stack, Text } from '@mantine/core';
import { Message, UserInfo } from './chat.interfaces';

interface ChatMessageProps {
  message: Message;
  users: UserInfo[];
}

export function ChatMessage({ message, users }: ChatMessageProps) {
  // timestamp is in UTC for standardization, convert to users local timezone so it shows correctly for them.
  const userTimeStamp = new Date(message.timestamp).toLocaleString();
  const matchingUser = users.find((user) => user.id === message.profiles.id);
  return (
    <Group align="flex-start" my="xs" wrap="nowrap" gap="xs">
      <Stack>
        <Indicator
          color={matchingUser ? 'green' : 'gray'}
          position="bottom-end"
          offset={3}
          withBorder
        >
          <Avatar size="md" src={matchingUser?.avatar ?? message.profiles.avatar} mt="4" />
        </Indicator>
      </Stack>
      <Stack gap="4">
        <Group gap="xs">
          <Group align="baseline" gap="xs">
            <Text size="md" fw={500}>
              {matchingUser?.username ?? message.profiles.username}
            </Text>
            <Text size="xs" c="dimmed">
              {userTimeStamp}
            </Text>
          </Group>
        </Group>
        <Paper p="xs" radius="lg" style={{ width: 'fit-content' }}>
          <HoverCard width={320} shadow="md" openDelay={200} closeDelay={400}>
            <HoverCard.Target>
              <Text size="sm">{message.message}</Text>
            </HoverCard.Target>
            <HoverCard.Dropdown>
              <Group>
                <Image src="/emotes/a_(smile)_40.webp" width={30} height={30} alt="big grin" />
                <Image src="/emotes/a_(biggrin)_40.webp" width={30} height={30} alt="big grin" />
              </Group>
            </HoverCard.Dropdown>
          </HoverCard>
        </Paper>
      </Stack>
    </Group>
  );
}
