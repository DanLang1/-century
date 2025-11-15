import { useState } from 'react';
import Image from 'next/image';
import { useChannel } from 'ably/react';
import camelcaseKeys from 'camelcase-keys';
import { Interweave } from 'interweave';
import { UrlMatcher } from 'interweave-autolink';
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

  const extractParentheses = (text: string): string | null => {
    const match = text.match(/\(([^)]+)\)/);
    return match ? `(${match[1]})` : null;
  };

  const formattedMessage = (messageToParse: string | null) => {
    if (messageToParse === null) {
      return null;
    }

    const hasAdminIcon = messageToParse.includes('(admin-icon)'); // Check if admin icon exists

    return (
      <Text size="sm" style={{ fontStyle: hasAdminIcon ? 'italic' : 'normal' }}>
        {messageToParse.split(/(\(.*?\))/g).map((part, index) =>
          emojiMap[part] ? (
            <Image
              unoptimized
              key={index}
              src={emojiMap[part].src}
              alt={part}
              width={emojiMap[part]?.width ?? 25}
              height={emojiMap[part]?.height ?? 25}
              style={{
                marginLeft: '3px',
                marginRight: '3px',
                marginBottom: emojiMap[part]?.height ? '-3px' : '-8px',
                marginTop: emojiMap[part]?.height ? '0px' : '5px',
              }}
            />
          ) : (
            <Interweave newWindow key={index} content={part} matchers={[new UrlMatcher('url')]} />
          )
        )}
      </Text>
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
      <Stack gap="4px">
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

        <EmojiReaction message={message} currUser={user}>
          <Paper p="xs" pr="lg" radius="lg" className={classes.paper}>
            {/* <EmojiReaction message={message} currUser={user} /> */}
            {formattedMessage(message.message)}
          </Paper>
        </EmojiReaction>

        <Group gap="2px">
          {Object.entries(reactionCounts)?.map(([emoji, { xatType, usernames }], index) => (
            <Tooltip
              color="grey"
              label={`${usernames.join(', ')} reacted with ${extractParentheses(emoji) ?? emoji}`}
              key={`${index}-${emoji}`}
            >
              <UnstyledButton
                onClick={() => handleEmojiReact(emoji, xatType)}
                className={classes.fitContent}
              >
                <Badge
                  my="5px"
                  key={`${emoji}-${index}`}
                  size="lg"
                  classNames={{ label: classes.label, root: classes.root }}
                  leftSection={
                    xatType ? (
                      <Image
                        src={emoji}
                        width={15}
                        height={15}
                        alt={emoji}
                        unoptimized
                        style={{
                          maxHeight: 15,
                          minHeight: 15,
                          maxWidth: 15,
                          minWidth: 15,
                          position: 'relative',
                        }}
                      />
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
