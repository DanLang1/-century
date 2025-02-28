'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2, IconUser, IconUsersGroup } from '@tabler/icons-react';
import { useChannel, usePresence, usePresenceListener } from 'ably/react';
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
  const { updateStatus } = usePresence('chat-demo');
  const { presenceData } = usePresenceListener('chat-demo');

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
    validate: {
      user: isNotEmpty(),
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

  const handleUserSet = () => {
    toggleModal();
    const message: Message = {
      message: pendingMessage,
      user: user === '' ? 'OstrichRider432' : user,
      timestamp: new Date().toLocaleString(),
      avatar: avatar,
    };
    channel.publish({ name: 'chat-message', data: message });
    const userInfo: User = {
      user: user,
      avatar: avatar,
    };
    updateStatus(userInfo);
    form.reset();
  };

  return (
    <Center pt={{ base: 'sm', md: 'xl' }}>
      <UserSelectModal
        modalOpened={modalOpened}
        toggleModal={toggleModal}
        user={user}
        setUser={setUser}
        avatar={avatar}
        setAvatar={setAvatar}
        handleContinue={handleUserSet}
      />

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
                    <Avatar
                      radius="xl"
                      size="sm"
                      src={user.data?.avatar ?? '/avatarIcons/303.png'}
                    />
                    <Text>{user.data?.user ?? 'RandoGuest'}</Text>
                  </Group>
                </Stack>
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
                  {presenceData.map((user, index) => (
                    <Group key={index} align="center">
                      <Avatar
                        radius="xl"
                        size="sm"
                        src={user.data?.avatar ?? '/avatarIcons/303.png'}
                      />
                      <Text>{user.data?.user ?? 'RandoGuest'}</Text>
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
