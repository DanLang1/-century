'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2, IconUsersGroup } from '@tabler/icons-react';
import { useChannel, usePresence, usePresenceListener } from 'ably/react';
import { produce } from 'immer';
import {
  ActionIcon,
  Center,
  Grid,
  Group,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { readLocalStorageValue, useDisclosure, useLocalStorage } from '@mantine/hooks';
import { ActiveUserDisplay } from './ActiveUserDisplay';
import { Chat, Message, UserForm, UserInfo } from './chat.interfaces';
import { ChatMessage } from './ChatMessage';
import { UserSelectModal } from './UserSelectModal';

const demoProps = {
  bg: 'var(--mantine-color-blue-light)',
  h: 400,
  mt: 'md',
};

export function ChatBox() {
  const theme = useMantineTheme();

  const [messages, setMessages] = useState<Message[]>([]);
  // const [user, setUser] = useState<string>('');
  const [pendingMessage, setPendingMessage] = useState<string>('');

  const [user, setUser] = useLocalStorage<UserInfo>({
    key: 'user-info',
    defaultValue: {
      username: 'xatRando',
      avatar: '/avatarIcons/303.png',
    },
  });

  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { toggle: toggleModal }] = useDisclosure(false);

  const { updateStatus } = usePresence(
    'chat-demo',
    readLocalStorageValue({ key: 'user-info' }) ?? user
  );
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

  const currentConnectionId = ably.connection.id ?? '';

  const currUsers: UserInfo[] = presenceData.map((presData) => {
    return {
      username: presData.data?.username,
      avatar: presData.data?.avatar,
      connectionId: presData.connectionId,
    };
  });

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

  const userForm = useForm<UserForm>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      user: '',
      avatar: '',
    },
    validate: {
      user: (value) => {
        if (value === '') {
          return 'Please enter an username';
        }
        if (
          presenceData?.some(
            (presence) =>
              presence.data?.username === value && presence.data?.username !== user.username
          )
        ) {
          return 'Someone already has this username :(';
        }
      },
    },
  });

  useEffect(() => {
    scrollToBottom();
    ref.current?.focus();
  }, [messages]);

  const handleSubmit = (values: Chat) => {
    if (user.username === 'xatRando') {
      toggleModal();
      setPendingMessage(values.message);
      return;
    }
    const message: Message = {
      message: values.message,
      user: user,
      timestamp: new Date().toLocaleString(),
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

  const handleUserSetForm = (values: UserForm) => {
    const userInfo: UserInfo = {
      username: values.user,
      avatar: values.avatar,
      // connectionId: currentConnectionId,
    };
    if (pendingMessage !== '') {
      const message: Message = {
        message: pendingMessage,
        user: userInfo,
        timestamp: new Date().toISOString(),
      };
      channel.publish({ name: 'chat-message', data: message });
    }

    updateStatus(userInfo);
    setUser(userInfo);
    setPendingMessage('');
    form.reset();
    toggleModal();
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
          p="sm"
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
                <ScrollArea h="50vh" type="always" viewportRef={viewport} p="0">
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
            <ActiveUserDisplay
              opened={opened}
              toggle={toggle}
              users={currUsers}
              openUserModal={toggleModal}
              currUserId={currentConnectionId}
            />
          </Grid>
        </Paper>
      </form>
    </Center>
  );
}
