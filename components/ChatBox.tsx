'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2 } from '@tabler/icons-react';
import { produce } from 'immer';
import {
  ActionIcon,
  Box,
  Button,
  Checkbox,
  Container,
  Flex,
  Grid,
  Group,
  ScrollArea,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getHotkeyHandler, useFocusReturn } from '@mantine/hooks';

interface Chat {
  message: string;
}
const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

export function ChatBox() {
  const [messages, setMessages] = useState<string[]>([]);
  const ref = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const form = useForm<Chat>({
    mode: 'uncontrolled',
    initialValues: {
      message: '',
    },
  });

  useEffect(() => {
    scrollToBottom();
    ref.current?.focus();
  }, [messages]);

  const handleSubmit = (values: Chat) => {
    console.log(values);
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        draft.push(values.message);
      })
    );
    form.reset();
    scrollToBottom();
    ref.current?.focus();
  };

  const send = () => {
    return (
      <ActionIcon type="submit" variant="transparent" aria-label="Send">
        <IconSend2 />
      </ActionIcon>
    );
  };

  return (
    <>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Container {...demoProps} size="lg">
          <ScrollArea h="400" type="always" viewportRef={viewport}>
            {messages.map((message, index) => (
              <ul key={index}>{message}</ul>
            ))}
          </ScrollArea>
        </Container>

        <Container pt="sm">
          <Grid>
            <TextInput
              placeholder="chat"
              key={form.key('message')}
              {...form.getInputProps('message')}
              ref={ref}
              rightSection={send()}
            />
          </Grid>
        </Container>
      </form>
    </>
  );
}
