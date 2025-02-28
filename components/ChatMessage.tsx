import { Avatar, Group, Paper, Stack, Text } from '@mantine/core';
import { Message } from './ChatBoxAbly';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  // timestamp is in UTC for standardization, convert to users local timezone so it shows correctly for them.
  const userTimeStamp = new Date(message.timestamp).toLocaleString();
  return (
    <Group align="flex-start" gap="xl" my="md">
      <Stack gap="4">
        <Group gap="xs">
          <Avatar size="sm" src={message.avatar} />
          <Group align="baseline" gap="xs">
            <Text size="md" weight={500}>
              {message.user}
            </Text>
            <Text size="xs" c="dimmed">
              {userTimeStamp}
            </Text>
          </Group>
        </Group>
        <Paper p="xs" radius="lg" style={{ width: 'fit-content' }}>
          <Text size="sm">{message.message}</Text>
        </Paper>
      </Stack>
    </Group>
  );
}
