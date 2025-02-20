'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2 } from '@tabler/icons-react';
import { produce } from 'immer';
import {
  ActionIcon,
  Avatar,
  Center,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { getHotkeyHandler, useFocusReturn, useMediaQuery } from '@mantine/hooks';

interface Chat {
  message: string;
}
const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

const users = ['Alice', 'Bob', 'Charlie', 'David'];

export function ChatBox() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})px`);
  const [messages, setMessages] = useState<string[]>([]);

  // const chatArea = {
  //   height: isMobile ? '100vh' : '80vh',
  //   width: '600px',
  //   display: 'flex',
  //   bg: 'var(--mantine-color-blue-light)',
  // };

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
    <Center pt="xl">
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Paper size="md" w="60vw" shadow="md" bd="md" p="lg" bg="var(--mantine-color-blue-light)">
          <Grid>
            <Grid.Col span={9}>
              <Stack>
                <ScrollArea
                  h="400"
                  type="always"
                  viewportRef={viewport}
                  bd="1px solid var(--mantine-color-blue-light)"
                  p="md"
                >
                  {messages.map((message, index) => (
                    <Group key={index} align="flex-start" my="md>" mb="sm">
                      <Avatar mt="sm" radius="lg" size="sm"></Avatar>
                      <Paper p="sm">
                        <Text size="sm">{message}</Text>
                      </Paper>
                    </Group>
                  ))}
                </ScrollArea>
                <TextInput
                  pt="sm"
                  placeholder="chat"
                  key={form.key('message')}
                  {...form.getInputProps('message')}
                  ref={ref}
                  rightSection={send()}
                />
              </Stack>
            </Grid.Col>
            <Grid.Col span={3}>
              <ScrollArea
                h="400"
                type="always"
                viewportRef={viewport}
                p="md"
                bg="var(--mantine-color-gray-light)"
              >
                <Stack>
                  {users.map((user, index) => (
                    <Group key={index} align="center">
                      <Avatar radius="xl" size="sm" />
                      <Text>{user}</Text>
                    </Group>
                  ))}
                </Stack>
              </ScrollArea>
            </Grid.Col>
          </Grid>
        </Paper>
      </form>
    </Center>
  );
}
