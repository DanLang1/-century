import { useState } from 'react';
import Image from 'next/image';
import { useChannel } from 'ably/react';
import camelcaseKeys from 'camelcase-keys';
import {
  Avatar,
  Badge,
  Group,
  Indicator,
  Paper,
  Stack,
  Text,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { addReaction, removeReaction } from '@/app/(main)/actions';
import { Message, ReactionDB, ReactionValue, UserInfo } from './chat.interfaces';
import { MessageType } from './ChatConstants';
import { emojiMap } from './EmojiModal/CustomEmojiConstants';
import { EmojiReaction } from './EmojiModal/EmojiReaction';
import classes from './ChatMessage.module.css';

interface ChatMessageProps {
  message: Message;
  users: UserInfo[];
  user: UserInfo;
}

export function ChatMessage({ message, users, user }: ChatMessageProps) {
  const { channel } = useChannel('chat-demo');
  // timestamp is in UTC for standardization, convert to users local timezone so it shows correctly for them.
  const [loading, setLoading] = useState(false);
  const userTimeStamp = new Date(message.timestamp).toLocaleString();
  const matchingUser = users.find((user) => user.id === message.senderId);
  const reactionCounts = (message.reactions ?? []).reduce<Record<string, ReactionValue>>(
    (acc, reaction) => {
      if (!acc[reaction.emoji]) {
        acc[reaction.emoji] = { xatType: reaction.emoji.includes('.webp'), usernames: [] };
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

  const handleEmojiReact = async (emoji: string, xatType: boolean) => {
    if (loading) {
      notifications.show({
        title: 'Slow Down',
        message: 'Slow down please or you will break the DB :(',
      });
      return;
    }
    setLoading(true);
    const reactions = message.reactions ?? [];
    const existingReaction = reactions.find(
      (reaction) => reaction.username === user.username && reaction.emoji === emoji
    );

    const messageWithEmoji: Message = {
      ...message,
    };

    if (existingReaction && existingReaction.reactionId) {
      const { error } = await removeReaction(existingReaction.reactionId);
      if (error) {
        notifications.show({
          title: 'You Win!',
          color: 'red',
          message: 'You broke the database, congratulations!',
        });
        setLoading(false);
        return;
      }
      messageWithEmoji.reactions = reactions.filter(
        (reaction) => reaction.reactionId !== existingReaction.reactionId
      );
    } else {
      const { data, error } = await addReaction(message.id, user.id, emoji);
      if (error) {
        notifications.show({
          title: 'You Win!',
          color: 'red',
          message: 'You broke the database, congratulations!',
        });
        setLoading(false);
        return;
      }
      if (data) {
        const reactionDb = camelcaseKeys(data);
        const reactionParsed: ReactionDB = {
          message_id: reactionDb.messageId ?? '',
          username: user.username,
          emoji: reactionDb.emoji ?? '',
          xatType,
          reactionId: reactionDb.id,
        };
        messageWithEmoji.reactions = [...reactions, reactionParsed];
      }
    }

    channel.publish({ name: MessageType.ReactionAdded, data: messageWithEmoji });
    setLoading(false);
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
          <Avatar size="md" src={matchingUser?.avatar ?? message.senderAvatar} mt="4" />
        </Indicator>
      </Stack>
      <Stack gap="4">
        <Group gap="xs">
          <Group align="baseline" gap="xs">
            <Text size="md" fw={500}>
              {matchingUser?.username ?? message.senderUsername}
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
              <UnstyledButton onClick={() => handleEmojiReact(emoji, xatType)}>
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
              </UnstyledButton>
            </Tooltip>
          ))}
        </Group>
      </Stack>
    </Group>
  );
}
