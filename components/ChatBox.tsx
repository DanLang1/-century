'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { produce } from 'immer';
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Drawer,
  Grid,
  Group,
  Modal,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';

interface Chat {
  message: string;
}

interface Message {
  message: string;
  user: string;
  timestamp: string;
}

const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

const users = ['Rud', 'Sow', 'Azx', 'Vamp'];

export function ChatBox() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})px`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<string>('');

  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { toggle: toggleModal }] = useDisclosure(false);

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
    validate: {
      message: isNotEmpty(),
    },
  });

  useEffect(() => {
    scrollToBottom();
    ref.current?.focus();
  }, [messages]);

  const handleSubmit = (values: Chat) => {
    if (!user) {
      toggleModal();
      setPendingMessage(values.message);
      return;
    }
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        draft.push({
          message: values.message,
          user: user === '' ? 'OstrichRider432' : user,
          timestamp: new Date().toLocaleString(),
        });
      })
    );
    form.reset();
    scrollToBottom();
    ref.current?.focus();
  };

  const send = (onClick?: () => void) => {
    return (
      <ActionIcon
        type="submit"
        variant="transparent"
        aria-label="Send"
        onClick={onClick}
        disabled={!form.isValid()}
      >
        <IconSend2 />
      </ActionIcon>
    );
  };

  const handleUserSet = () => {
    toggleModal();
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        draft.push({
          message: pendingMessage,
          user: user === '' ? 'OstrichRider432' : user,
          timestamp: new Date().toLocaleString(),
        });
      })
    );
    form.reset();
    scrollToBottom();
    ref.current?.focus();
  };

  return (
    <Center pt="xl">
      <Modal
        opened={modalOpened}
        onClose={toggleModal}
        title="Please enter a username to use for chatting"
      >
        <TextInput
          pt="sm"
          placeholder="username"
          leftSection={<IconUser />}
          rightSection={send(handleUserSet)}
          value={user}
          onChange={(event) => setUser(event.currentTarget.value)}
          required
          maxLength={15}
        />
      </Modal>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Paper
          size="md"
          w={{ base: '90vw', sm: '50vw', md: '60vw', lg: '50vw' }}
          shadow="md"
          bd="md"
          p="lg"
          bg="var(--mantine-color-blue-light)"
        >
          <Grid>
            <Grid.Col span={{ base: 12, sm: 9 }}>
              {/* small screen users button */}
              <Group pb="sm" justify="flex-end" hiddenFrom="sm">
                <ActionIcon
                  variant="gradient"
                  size="md"
                  aria-label="Gradient action icon"
                  gradient={{ from: 'blue', to: 'cyan', deg: 90 }}
                  onClick={toggle}
                >
                  <IconUsersGroup />
                </ActionIcon>
              </Group>
              <Stack>
                <ScrollArea
                  h="400"
                  type="always"
                  viewportRef={viewport}
                  bd="1px solid var(--mantine-color-blue-light)"
                  p="md"
                >
                  {messages.map((message, index) => (
                    <Group key={index} align="flex-start" my="md" mb="sm">
                      <Avatar mt="sm" radius="lg" size="sm" />
                      <div>
                        <Group gap="xs">
                          <Text size="sm" weight={500}>
                            {message.user}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {message.timestamp}
                          </Text>
                        </Group>
                        <Paper p="sm" mt="xs">
                          <Text size="sm">{message.message}</Text>
                        </Paper>
                      </div>
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
                  {...form.getInputProps('message')}
                />
              </Stack>
            </Grid.Col>
            {/* for small screens */}
            <Drawer
              offset={8}
              radius="md"
              opened={opened}
              onClose={toggle}
              title="Users"
              position="right"
            >
              {users.map((user, index) => (
                <Group key={index} align="center">
                  <Avatar radius="xl" size="sm" />
                  <Text>{user}</Text>
                </Group>
              ))}
            </Drawer>
            {/* for large screens */}
            <Grid.Col span={3} visibleFrom="sm">
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
