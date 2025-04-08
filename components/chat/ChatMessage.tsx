import Image from 'next/image';
import { Avatar, Badge, Group, Indicator, Paper, Stack, Text, Tooltip } from '@mantine/core';
import { Message, ReactionValue, UserInfo } from './chat.interfaces';
import { emojiMap } from './EmojiModal/CustomEmojiConstants';
import { EmojiReaction } from './EmojiModal/EmojiReaction';
import classes from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  users: UserInfo[];
  user: UserInfo;
}

export function ChatMessage({ message, users, user }: ChatMessageProps) {
  // timestamp is in UTC for standardization, convert to users local timezone so it shows correctly for them.
  const userTimeStamp = new Date(message.timestamp).toLocaleString();
  const matchingUser = users.find((user) => user.id === message.profiles.id);
  const reactionCounts = (message.reactions ?? []).reduce<Record<string, ReactionValue>>(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = { xatType: reaction.xatType, usernames: [] };
      }

      acc[reaction.emoji].usernames.push(reaction.username);
      return acc;
    },
    {}
  );

  const formatMessage = (message: string | null) => {
    if (message === null) {
      return null;
    }

    return message
      .split(/(\(.*?\))/g)
      .map((part, index) =>
        emojiMap[part] ? (
          <Image
            unoptimized
            key={index}
            src={emojiMap[part]}
            alt={part}
            width={25}
            height={25}
            style={{ marginLeft: '2px', marginBottom: '-3px' }}
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

        <Paper p="xs" pr="lg" radius="lg" className={classes.paper}>
          <EmojiReaction message={message} currUser={user} />
          <Text size="sm">{formatMessage(message.message)}</Text>
        </Paper>

        <Group gap="2px">
          {Object.entries(reactionCounts)?.map(([emoji, { xatType, usernames }], index) => (
            <Tooltip color="grey" label={usernames.join(', ')} key={`${index}-${emoji}`}>
              <Badge
                key={`${emoji}-${index}`}
                size="lg"
                classNames={{ label: classes.label, root: classes.root }}
                leftSection={
                  xatType ? (
                    <Image src={emoji} width={15} height={15} alt={emoji} unoptimized />
                  ) : (
                    emoji
                  )
                }
              >
                {usernames.length}
              </Badge>
            </Tooltip>
          ))}
        </Group>
      </Stack>
    </Group>
  );
}
