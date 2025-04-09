import { useState } from 'react';
import { IconMoodSmile } from '@tabler/icons-react';
import { useChannel } from 'ably/react';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { ActionIcon, Popover } from '@mantine/core';
import { addReaction } from '@/app/(main)/actions';
import { Message, UserInfo } from '../chat.interfaces';
import { MessageType } from '../ChatConstants';
import { customEmojis, emojiCategories } from './CustomEmojiConstants';
import classes from '../ChatMessage.module.css';

interface EmojiReactionProps {
  message: Message;
  currUser: UserInfo;
}

export function EmojiReaction({ message, currUser }: EmojiReactionProps) {
  const { channel } = useChannel('chat-demo');
  const [open, setOpen] = useState(false);
  const onEmojiClick = (emojiObject: EmojiClickData) => {
    const xatType = emojiObject.imageUrl?.includes('.webp') ?? false;
    const emoji = xatType ? emojiObject.imageUrl : emojiObject.emoji;
    const reactions = message.reactions ?? [];

    const existingReactionIndex = reactions.findIndex(
      (reaction) => reaction.username === currUser.username && reaction.emoji === emoji
    );

    const updatedReactions =
      existingReactionIndex !== -1
        ? reactions.filter((_, i) => i !== existingReactionIndex)
        : [
            ...reactions,
            {
              emoji,
              username: currUser.username,
              xatType,
              userId: currUser.id,
              message_id: message.id,
            },
          ];

    const messageWithEmoji: Message = {
      ...message,
      reactions: updatedReactions,
    };
    channel.publish({ name: MessageType.ReactionAdded, data: messageWithEmoji });
    if (existingReactionIndex === -1) {
      // create new reaction
      addReaction(message.id, currUser.id, emoji);
    }
    setOpen(false);
  };

  return (
    <Popover
      opened={open}
      position="bottom"
      styles={{ dropdown: { padding: 0, background: 'transparent', border: 'none' } }}
      onChange={setOpen}
    >
      <Popover.Target>
        <ActionIcon
          variant="transparent"
          className={classes.actionIcon}
          size="17"
          onClick={() => setOpen((o) => !o)}
        >
          <IconMoodSmile color="grey" />
        </ActionIcon>
      </Popover.Target>
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
