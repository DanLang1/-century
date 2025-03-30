import { RefObject } from 'react';
import { IconMoodSmile } from '@tabler/icons-react';
import EmojiPicker, { EmojiClickData, EmojiStyle, Theme } from 'emoji-picker-react';
import { ActionIcon, Popover } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { Chat } from '../chat.interfaces';
import { emojiCategories } from './EmojiCategories';

interface EmojiModalProps {
  form: UseFormReturnType<Chat>;
  inputRef: RefObject<HTMLInputElement | null>;
}

export function EmojiModal({ form, inputRef }: EmojiModalProps) {
  const onEmojiClick = (emojiObject: EmojiClickData) => {
    if (!inputRef.current) {
      return;
    }
    const { selectionStart, selectionEnd, value } = inputRef.current;
    if (selectionStart === null || selectionEnd === null) {
      return;
    }

    const newVal = value.slice(0, selectionStart) + emojiObject.emoji + value.slice(selectionEnd);
    form.setValues({ message: newVal });
  };

  const customEmojis = [
    {
      names: ['Big Grin', 'big grin'],
      imgUrl: '/emotes/a_(biggrin)_40.webp',
      id: '(biggrin)',
    },
    {
      names: ['Smile', 'smile'],
      imgUrl: '/emotes/a_(smile)_40.webp',
      id: '(smile)',
    },
  ];

  return (
    <Popover
      position="bottom"
      styles={{
        dropdown: {
          padding: 0,
          background: 'transparent',
          border: 'none',
        },
      }}
    >
      <Popover.Target>
        <ActionIcon variant="transparent">
          <IconMoodSmile />
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
