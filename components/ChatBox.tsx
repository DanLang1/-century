'use client';

import { useEffect, useRef, useState } from 'react';
import { createClient, RealtimeChannel } from '@supabase/supabase-js';
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
import { AvatarSelector } from './AvatarSelector';

interface Chat {
  message: string;
}

interface Message {
  message: string;
  user: string;
  timestamp: string;
  avatar: string;
}

const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

const users = [
  { name: 'Rud', avatar: '/avatarIcons/1504.png' },
  { name: 'Sow', avatar: '/avatarIcons/1619.png' },
  { name: 'Azx', avatar: '/avatarIcons/196.png' },
];

export function ChatBox() {
  const channel = useRef<RealtimeChannel | null>(null);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})px`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const [createUserNameVisible, setCreateUserNameVisible] = useState<boolean>(false);

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
    if (!channel.current) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      channel.current = client.channel('chat-room', {
        config: {
          broadcast: {
            self: true,
          },
        },
      });

      channel.current
        .on('broadcast', { event: 'message' }, ({ payload }) => {
          setMessages((prevMessages) =>
            produce(prevMessages, (draft) => {
              draft.push(
                payload.message
                // message: payload.message.message,
                // user: user === '' ? 'OstrichRider432' : user,
                // timestamp: new Date().toLocaleString(),
              );
            })
          );
        })
        .subscribe();
    }

    return () => {
      channel.current?.unsubscribe();
      channel.current = null;
    };
  }, []);

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
    // setMessages((prevMessages) =>
    //   produce(prevMessages, (draft) => {
    //     draft.push({
    //       message: values.message,
    //       user: user === '' ? 'OstrichRider432' : user,
    //       timestamp: new Date().toLocaleString(),
    //     });
    //   })
    // );
    if (!channel.current) return;
    channel.current.send({
      type: 'broadcast',
      event: 'message',
      payload: {
        message: {
          message: values.message,
          user: user === '' ? 'OstrichRider432' : user,
          timestamp: new Date().toLocaleString(),
          avatar: avatar,
        },
      },
    });
    form.reset();
    // scrollToBottom();
    // ref.current?.focus();
  };

  const send = () => {
    return (
      <ActionIcon type="submit" variant="transparent" aria-label="Send" disabled={!form.isValid()}>
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
          avatar: avatar,
        });
      })
    );
    form.reset();
    scrollToBottom();
    ref.current?.focus();
  };

  return (
    <Center pt="xl">
      <Modal opened={modalOpened} onClose={toggleModal} title="Select User Icon and Username">
        <Stack>
          <AvatarSelector value={avatar} setValue={setAvatar} />

          <TextInput
            pt="sm"
            placeholder="username"
            leftSection={<IconUser />}
            value={user}
            onChange={(event) => setUser(event.currentTarget.value)}
            required
            maxLength={15}
          />
          <Button onClick={handleUserSet} disabled={user === ''}>
            Continue
          </Button>
        </Stack>
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
                <ScrollArea h="400" type="always" viewportRef={viewport} p="md">
                  {messages.map((message, index) => (
                    <Group key={index} align="flex-start" my="md" mb="sm">
                      <Avatar radius="lg" size="sm" src={message.avatar} mt="xl" />
                      <div>
                        <Group gap="xs">
                          <Text size="sm" weight={500}>
                            {message.user}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {message.timestamp}
                          </Text>
                        </Group>
                        <Paper p="sm">
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
                // viewportRef={viewport}
                p="md"
                bg="var(--mantine-color-gray-light)"
                bd="rounded"
              >
                <Stack>
                  {users.map((user, index) => (
                    <Group key={index} align="center">
                      <Avatar radius="xl" size="sm" src={user.avatar} />
                      <Text>{user.name}</Text>
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
