'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2, IconUsersGroup } from '@tabler/icons-react';
import { useChannel, usePresence, usePresenceListener } from 'ably/react';
import { produce } from 'immer';
import {
  ActionIcon,
  Avatar,
  Center,
  Drawer,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  Text,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ChatMessage } from './ChatMessage';
import { UserSelectModal } from './UserSelectModal';

interface Chat {
  message: string;
}

export interface Message {
  message: string;
  user: string;
  timestamp: string;
  avatar: string;
}

export interface User {
  user: string;
  avatar: string;
}

const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

export function ChatBoxAbly() {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})px`);
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');

  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { toggle: toggleModal }] = useDisclosure(false);

  const { updateStatus } = usePresence('chat-demo', {
    user: 'xatRando',
    avatar: '/avatarIcons/303.png',
  });
  const { presenceData } = usePresenceListener('chat-demo');

  const { channel, ably } = useChannel('chat-demo', (message) => {
    setMessages((prevMessages) =>
      produce(prevMessages, (draft) => {
        if (draft.length > 200) {
          draft.shift();
        }
        draft.push(message.data);
      })
    );
  });

  // channel.presence.enter({ user: user, avatar: avatar });

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

  const userForm = useForm<User>({
    mode: 'uncontrolled',
    initialValues: {
      user: '',
      avatar: '',
    },
    validate: {
      user: (value) => {
        if (presenceData?.some((presence) => presence.data?.user === value)) {
          return 'Someone already has this username :(';
        }
        isNotEmpty();
      },
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
    const message: Message = {
      message: values.message,
      user: user === '' ? 'OstrichRider432' : user,
      timestamp: new Date().toLocaleString(),
      avatar: avatar,
    };
    channel.publish({ name: 'chat-message', data: message });
    form.reset();
  };

  const send = () => {
    return (
      <ActionIcon type="submit" variant="transparent" aria-label="Send" disabled={!form.isValid()}>
        <IconSend2 />
      </ActionIcon>
    );
  };

  const handleUserSetForm = (values: User) => {
    toggleModal();
    const message: Message = {
      message: pendingMessage,
      user: values.user,
      timestamp: new Date().toISOString(),
      avatar: values.avatar,
    };
    channel.publish({ name: 'chat-message', data: message });
    const userInfo: User = {
      user: values.user,
      avatar: values.avatar,
    };
    updateStatus(userInfo);
    setUser(values.user);
    setAvatar(values.avatar);
    form.reset();
  };

  return (
    <Center pt={{ base: 'sm', md: 'xl' }}>
      <form id="userForm" onSubmit={userForm.onSubmit((values) => handleUserSetForm(values))}>
        <UserSelectModal modalOpened={modalOpened} toggleModal={toggleModal} form={userForm} />
      </form>

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
                <ScrollArea h="50vh" type="always" viewportRef={viewport} p="sm">
                  {messages.map((message, index) => (
                    <ChatMessage key={index} message={message} />
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
            {/* for small screens */}
            <Drawer
              offset={8}
              radius="md"
              opened={opened}
              onClose={toggle}
              title="Users"
              position="right"
            >
              {presenceData.map((user, index) => (
                <Stack key={index} mt="sm">
                  <Group align="center" gap="sm">
                    <Avatar radius="xl" size="sm" src={user.data?.avatar} />
                    <Text>{user.data?.user}</Text>
                  </Group>
                </Stack>
              ))}
            </Drawer>
            {/* for large screens */}
            <Grid.Col span={3} visibleFrom="sm">
              <ScrollArea
                h="60vh"
                type="always"
                p="md"
                bg="var(--mantine-color-gray-light)"
                bd="rounded"
              >
                <Stack>
                  {presenceData.map((user, index) => (
                    <Group key={index} align="center">
                      <Avatar radius="xl" size="sm" src={user.data?.avatar} />
                      <Text>{user.data?.user}</Text>
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
