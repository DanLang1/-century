import React, { useState } from 'react';
import { useChannel } from 'ably/react';
import camelcaseKeys from 'camelcase-keys';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { Popover } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { addReaction, removeReaction } from '@/app/(main)/actions';
import { Message, ReactionDB, UserInfo } from '../chat.interfaces';
import { MessageType } from '../ChatConstants';
import { customEmojis, emojiCategories } from './CustomEmojiConstants';

interface EmojiReactionProps {
  message: Message;
  currUser: UserInfo;
  children: React.ReactNode;
}

export function EmojiReaction({ message, currUser, children }: EmojiReactionProps) {
  const { channel } = useChannel('chat-demo');
  const [loading, setLoading] = useState(false);

  const onEmojiClick = async (emojiObject: EmojiClickData) => {
    if (loading) {
      notifications.show({
        title: 'Slow Down',
        message: 'Slow down please or you will break the DB :(',
      });
      return;
    }
    setLoading(true);
    const xatType = emojiObject.imageUrl?.includes('.webp') ?? false;
    const emoji = xatType ? emojiObject.imageUrl : emojiObject.emoji;
    const reactions = message.reactions ?? [];

    const existingReaction = reactions.find(
      (reaction) => reaction.username === currUser.username && reaction.emoji === emoji
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
      const { data, error } = await addReaction(message.id, currUser.id, emoji);
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
          username: currUser.username,
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
    <Popover
      position="bottom"
      styles={{ dropdown: { padding: 0, background: 'transparent', border: 'none' } }}
      trapFocus
    >
      <Popover.Target>{children}</Popover.Target>
      <Popover.Dropdown>
        <EmojiPicker
          categories={emojiCategories}
          lazyLoadEmojis
          customEmojis={customEmojis}
          onEmojiClick={onEmojiClick}
          theme={Theme.DARK}
          emojiStyle={EmojiStyle.NATIVE}
          skinTonesDisabled
          autoFocusSearch={false}
        />
      </Popover.Dropdown>
    </Popover>
  );
}
