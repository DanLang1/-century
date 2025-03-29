'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2 } from '@tabler/icons-react';
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
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery, useThrottledCallback } from '@mantine/hooks';
import {
  createAnonymousUser,
  getMessages,
  revalidateMain,
  sendMessage,
  updateUser,
} from '@/app/(main)/actions';
import { chatMessageSchema } from '@/lib/validation';
import { ActiveAvatarDisplay } from './ActiveAvatarDisplay';
import { ActiveUserDisplay } from './ActiveUserDisplay';
import { Chat, Message, UserForm, UserInfo } from './chat.interfaces';
import { MessageType } from './ChatConstants';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { UserSelectModal } from './UserSelectModal';

interface ChatProps {
  user: UserInfo;
  existingMessages: Message[];
}

type TypingTimeouts = {
  [userId: string]: NodeJS.Timeout;
};

export function ChatBox({ user, existingMessages }: ChatProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const typingTimeouts = useRef<TypingTimeouts>({});
  const [messages, setMessages] = useState<Message[]>(existingMessages);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [usersTyping, setUsersTyping] = useState<UserInfo[]>([]);

  const [opened, { toggle }] = useDisclosure();
  const [modalOpened, { toggle: toggleModal }] = useDisclosure(false);

  const { updateStatus } = usePresence('chat-demo', user);
  const { presenceData } = usePresenceListener('chat-demo');

  const { channel } = useChannel('chat-demo', (message) => {
    if (message.name === MessageType.ChatMessage) {
      setMessages((prevMessages) =>
        produce(prevMessages, (draft) => {
          if (draft.length > 200) {
            draft.shift();
          }
          draft.push(message.data);
        })
      );
    } else if (message.name === MessageType.TypingEvent) {
      // Clear any existing timeout for this user first
      if (typingTimeouts.current[message.data.id]) {
        clearTimeout(typingTimeouts.current[message.data.id]);
        delete typingTimeouts.current[message.data.id];
      }

      // Update the typing users list
      setUsersTyping((prevUsers) =>
        produce(prevUsers, (draft) => {
          const existingUserIndex = draft.findIndex((user) => user.id === message.data.id);

          if (existingUserIndex === -1) {
            draft.push(message.data);
          } else {
            draft[existingUserIndex] = message.data;
          }
        })
      );

      // Set new timeout after state update
      typingTimeouts.current[message.data.id] = setTimeout(() => {
        setUsersTyping((prevUsers) =>
          produce(prevUsers, (draft) => {
            const index = draft.findIndex((user) => user.id === message.data.id);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
        delete typingTimeouts.current[message.data.id];
      }, 2000);
    }
  });

  const currUsers: UserInfo[] = presenceData.map((presData) => {
    return {
      username: presData.data?.username,
      avatar: presData.data?.avatar,
      id: presData.clientId,
      anonymous: presData.data?.anonymous,
    };
  });

  const ref = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const form = useForm<Chat>({
    mode: 'controlled',
    initialValues: {
      message: '',
    },
    validate: zodResolver(chatMessageSchema),
  });

  const userForm = useForm<UserForm>({
    mode: 'uncontrolled',
    validateInputOnChange: true,
    initialValues: {
      username: user.username === 'xatRando' ? '' : user.username,
      avatar: user.avatar,
    },
    validate: {
      username: (value) => {
        if (value === '') {
          return 'Please enter an username';
        }
        if (
          presenceData?.some(
            (presence) =>
              presence.data?.username === value && presence.data?.username !== user?.username
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

  const handleSubmit = async (values: Chat) => {
    if (!user) {
      return;
    }
    if (user?.username === 'xatRando') {
      toggleModal();
      setPendingMessage(values.message);
      return;
    }

    // pub message immediately, then save
    const tempMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message: values.message,
      profiles: {
        username: user.username,
        avatar: user.avatar,
        id: user.id,
      },
    };

    channel.publish({ name: MessageType.ChatMessage, data: tempMessage });
    form.reset();
    // if saving message fails, hopefully it wasn't important
    await sendMessage(user.id, values.message);
  };

  const send = () => {
    return (
      <ActionIcon type="submit" variant="transparent" aria-label="Send" disabled={!form.isValid()}>
        <IconSend2 />
      </ActionIcon>
    );
  };

  const handleUserSetForm = async (values: UserForm) => {
    const formData = new FormData();
    formData.append('username', values.username);
    formData.append('avatar', values.avatar);

    let userInfoFromDb: UserInfo = user;

    if (user.id !== '') {
      const result = await updateUser(formData, user.id);
      if (result.errors) {
        userForm.setErrors(result.errors);
        return;
      }
      userInfoFromDb = {
        username: result.data.username,
        avatar: result.data.avatar,
        id: result.data.id,
      };
    } else {
      const result = await createAnonymousUser(formData);
      if (result.errors) {
        userForm.setErrors(result.errors);
        setPendingMessage('');
        return;
      }
      userInfoFromDb = result?.user ?? userInfoFromDb;
      if (pendingMessage !== '') {
        const tempMessage: Message = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          message: pendingMessage,
          profiles: {
            username: userInfoFromDb.username,
            avatar: userInfoFromDb.avatar,
            id: userInfoFromDb.id,
          },
        };
        channel.publish({ name: MessageType.ChatMessage, data: tempMessage });
        await sendMessage(userInfoFromDb.id, pendingMessage);
      }
      const messages = await getMessages();
      setMessages(messages.data);
    }

    updateStatus(userInfoFromDb);
    setPendingMessage('');
    form.reset();
    toggleModal();
    revalidateMain();
  };

  const handleTyping = useThrottledCallback(() => {
    channel.publish(MessageType.TypingEvent, user);
  }, 3000);

  // TODO: More elegant way to handle the VH for chat area. Very hacky rn
  return (
    <Center pt={{ base: 'sm', md: 'xl' }}>
      <form id="userForm" onSubmit={userForm.onSubmit((values) => handleUserSetForm(values))}>
        <UserSelectModal
          modalOpened={modalOpened}
          toggleModal={toggleModal}
          form={userForm}
          user={user}
        />
      </form>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Paper
          w={{ base: '100vw', sm: '50vw', md: '60vw', lg: '70vw' }}
          shadow="md"
          bd="md"
          radius={isMobile ? 'xs' : 'md'}
          p="sm"
          bg="var(--mantine-color-blue-light)"
        >
          <Grid>
            <Grid.Col span={{ base: 12, sm: 9 }}>
              {/* small screen users button */}
              <Group pb="sm" justify="flex-end" hiddenFrom="sm">
                <ActiveAvatarDisplay users={currUsers} openDrawer={toggle} />
              </Group>
              <Stack gap="2px">
                <ScrollArea
                  scrollbars="y"
                  h={
                    isMobile
                      ? `calc(100vh - var(--app-shell-header-height) - var(--app-shell-padding) - 15em)`
                      : '50vh'
                  }
                  type="always"
                  viewportRef={viewport}
                  p="0"
                >
                  {messages.map((message) => (
                    <ChatMessage key={message.id} message={message} users={currUsers} />
                  ))}
                </ScrollArea>
                <TypingIndicator usersTyping={usersTyping} />
                <TextInput
                  pt="sm"
                  placeholder="chat"
                  {...form.getInputProps('message')}
                  key={form.key('message')}
                  onChange={(event) => {
                    form.setFieldValue('message', event.target.value);
                    handleTyping();
                  }}
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
              currUserId={user?.id}
            />
          </Grid>
        </Paper>
      </form>
    </Center>
  );
}
