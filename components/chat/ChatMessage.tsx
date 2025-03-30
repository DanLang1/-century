import Image from 'next/image';
import { Avatar, Group, Indicator, Paper, Stack, Text } from '@mantine/core';
import { Message, UserInfo } from './chat.interfaces';

interface ChatMessageProps {
  message: Message;
  users: UserInfo[];
}

export function ChatMessage({ message, users }: ChatMessageProps) {
  // timestamp is in UTC for standardization, convert to users local timezone so it shows correctly for them.
  const userTimeStamp = new Date(message.timestamp).toLocaleString();
  const matchingUser = users.find((user) => user.id === message.profiles.id);

  const emojiMap: Record<string, string> = {
    '(biggrin)': '/emotes/a_(biggrin)_40.webp',
    '(smile)': '/emotes/a_(smile)_40.webp',
  };

  const formatMessage = (message: string | null) => {
    if (message === null) {
      return null;
    }

    return message.split(/(\(.*?\))/g).map((part, index) =>
      emojiMap[part] ? (
        <Image
          key={index}
          src={emojiMap[part]}
          alt={part}
          width={15}
          height={15}
          style={{
            marginLeft: '2px',
            marginBottom: '-3px',
          }}
        />
      ) : (
        part
      )
    );
  };

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
          {/* <HoverCard width={320} shadow="md">
            <HoverCard.Target> */}
          <Text size="sm">{formatMessage(message.message)}</Text>
          {/* </HoverCard.Target> */}
          {/* <HoverCard.Dropdown>
              <Group>
                <Image src="/emotes/a_(smile)_40.webp" width={30} height={30} alt="big grin" />
                <Image src="/emotes/a_(biggrin)_40.webp" width={30} height={30} alt="big grin" />
              </Group>
            </HoverCard.Dropdown> */}
          {/* </HoverCard> */}
        </Paper>
        {/* 
        <Badge
          size="lg"
          // px="xs"
          variant="filled"
          color="#181919"
          bd="1px solid #2f2f2f"
          // bd="1px solid var(--mantine-color-gray-light)"
          leftSection={
            <Image src="/emotes/a_(smile)_40.webp" width={15} height={15} alt="big grin" />
          }
        >
          1
        </Badge> */}
      </Stack>
    </Group>
  );
}
