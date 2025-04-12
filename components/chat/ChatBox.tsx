'use client';

import { useEffect, useRef, useState } from 'react';
import { IconSend2 } from '@tabler/icons-react';
import { useChannel, usePresence, usePresenceListener } from 'ably/react';
import { produce } from 'immer';
import {
  ActionIcon,
  Center,
  darken,
  Group,
  Paper,
  ScrollArea,
  Stack,
  TextInput,
  useMantineTheme,
} from '@mantine/core';
import { useForm, zodResolver } from '@mantine/form';
import { useDisclosure, useMediaQuery, useThrottledCallback } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
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
import { ActiveUserDisplayMobile } from './ActiveUserDisplayMobile';
import { Chat, Message, UserForm, UserInfo } from './chat.interfaces';
import { MessageType } from './ChatConstants';
import { ChatMessage } from './ChatMessage';
import { EmojiModal } from './EmojiModal/EmojiModal';
import { TypingIndicator } from './TypingIndicator';
import { UserSelectModal } from './UserSelectModal';

interface ChatProps {
  user: UserInfo;
  existingMessages: Message[];
}

type TypingTimeouts = { [userId: string]: NodeJS.Timeout };

export function ChatBox({ user, existingMessages }: ChatProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const typingTimeouts = useRef<TypingTimeouts>({});
  const inputRef = useRef<HTMLInputElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>(existingMessages);
  const [pendingMessage, setPendingMessage] = useState<string>('');
  const [usersTyping, setUsersTyping] = useState<UserInfo[]>([]);
  const [lastSent, setLastSent] = useState<number>(0);
  const [loading, setLoading] = useState(false);

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
    } else if (message.name === MessageType.ReactionAdded) {
      setMessages((prevMessages) =>
        produce(prevMessages, (draft) => {
          const index = draft.findIndex((m) => m.id === message.data.id);
          if (index !== -1) {
            draft[index] = message.data;
          }
        })
      );
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

  const scrollToBottom = () =>
    viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'smooth' });

  const form = useForm<Chat>({
    mode: 'controlled',
    initialValues: { message: '' },
    validateInputOnChange: true,
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
    inputRef.current?.focus();
  }, [messages]);

  useEffect(() => {
    if (usersTyping.length > 0 && isNearBottom()) {
      scrollToBottom();
      inputRef.current?.focus();
    }
  }, [usersTyping]);

  // Helper function
  const isNearBottom = () => {
    const { scrollTop, scrollHeight, clientHeight } = viewport.current ?? {
      scrollTop: 0,
      scrollHeight: 0,
      clientHeight: 0,
    };
    return scrollHeight - (scrollTop + clientHeight) < 200;
  };

  const throttledSubmit = useThrottledCallback(async (values: Chat) => {
    if (!user) {
      return;
    }

    if (user?.username === 'xatRando') {
      toggleModal();
      setPendingMessage(values.message);
      return;
    }

    let messageToSend = values.message;

    if (values.message.trim() === '!roll') {
      const roll = Math.floor(Math.random() * 100) + 1;
      messageToSend = `(admin-icon) ${user.username} rolled ${roll}`;
    }

    const tempMessage: Message = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      message: messageToSend,
      senderUsername: user.username,
      senderAvatar: user.avatar,
      senderId: user.id,
    };

    channel.publish({ name: MessageType.ChatMessage, data: tempMessage });
    form.reset();

    const { error } = await sendMessage(user.id, messageToSend, tempMessage.id);
    if (error) {
      notifications.show({
        title: 'You Win!',
        color: 'red',
        message: 'You broke the database, congratulations!',
      });
    }

    setLastSent(Date.now());
  }, 1000);

  const handleSubmit = (values: Chat) => {
    if (!values.message) {
      return;
    }
    const now = Date.now();
    if (now - lastSent < 1000) {
      notifications.show({
        title: 'Pls Slow Down!',
        message: 'Pls no spammer 🐧',
        color: 'yellow',
        autoClose: 3000,
      });
    }

    throttledSubmit(values);
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
      setLoading(true);
      const result = await updateUser(formData, user.id);
      if (result.errors) {
        userForm.setErrors(result.errors);
        setLoading(false);
        return;
      }
      userInfoFromDb = {
        username: result.data.username,
        avatar: result.data.avatar,
        id: result.data.id,
      };
      setLoading(false);
    } else {
      setLoading(true);
      const result = await createAnonymousUser(formData);
      if (result.errors) {
        userForm.setErrors(result.errors);
        setPendingMessage('');
        setLoading(false);
        return;
      }
      userInfoFromDb = result?.user ?? userInfoFromDb;
      if (pendingMessage !== '') {
        const tempMessage: Message = {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          message: pendingMessage,
          senderUsername: userInfoFromDb.username,
          senderAvatar: userInfoFromDb.avatar,
          senderId: userInfoFromDb.id,
        };
        channel.publish({ name: MessageType.ChatMessage, data: tempMessage });
        const { error } = await sendMessage(userInfoFromDb.id, pendingMessage, tempMessage.id);
        if (error) {
          setLoading(false);
          notifications.show({
            title: 'You Win!',
            color: 'red',
            message: 'You broke the database, congratulations!',
          });
        }
      }
      const messages = await getMessages();
      setMessages(messages);
      setLoading(false);
    }

    updateStatus(userInfoFromDb);
    setPendingMessage('');
    form.reset();
    toggleModal();
    revalidateMain();
  };

  const handleTyping = useThrottledCallback(() => {
    if (user.id) {
      channel.publish(MessageType.TypingEvent, user);
    }
  }, 2000);

  // TODO: More elegant way to handle the VH for chat area. Very hacky rn
  return (
    <Center pt={{ base: 'sm', md: 'md' }}>
      <form id="userForm" onSubmit={userForm.onSubmit((values) => handleUserSetForm(values))}>
        <UserSelectModal
          modalOpened={modalOpened}
          toggleModal={toggleModal}
          form={userForm}
          user={user}
          loading={loading}
        />
      </form>

      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <Group gap="5px">
          <Paper
            w={{ base: '100vw', sm: '40vw' }}
            shadow="md"
            bd="md"
            radius={isMobile ? 'xs' : 'md'}
            p="sm"
            bg={darken('var(--mantine-color-blue-light)', 0.15)}
            h={isMobile ? 'auto' : '60vh'}
          >
            {/* small screen users button */}
            <Group pb="sm" justify="flex-end" hiddenFrom="sm">
              <ActiveAvatarDisplay users={currUsers} openDrawer={toggle} />
            </Group>
            <Stack gap="2px" style={{ height: '100%' }}>
              <ScrollArea
                scrollbars="y"
                style={{
                  flexGrow: 1,
                  height: isMobile
                    ? `calc(100vh - var(--app-shell-header-height) - var(--app-shell-padding) - 15em)`
                    : `calc(100vh - var(--app-shell-header-height) - 10em)`,
                  minHeight: '200px', // Ensures it never gets too small
                  willChange: 'transform', // prevent animated gifs jitter
                }}
                type="always"
                viewportRef={viewport}
                p="0"
                offsetScrollbars="y"
              >
                {messages.map((message) => (
                  <ChatMessage key={message.id} message={message} users={currUsers} user={user} />
                ))}
                <TypingIndicator usersTyping={usersTyping} />
              </ScrollArea>

              <TextInput
                mt="xs"
                placeholder="chat"
                {...form.getInputProps('message')}
                key={form.key('message')}
                onChange={(event) => {
                  form.setFieldValue('message', event.target.value);
                  handleTyping();
                }}
                ref={inputRef}
                leftSection={<EmojiModal form={form} inputRef={inputRef} />}
                rightSection={send()}
                error={form.errors.message}
              />
            </Stack>
            <ActiveUserDisplayMobile
              opened={opened}
              toggle={toggle}
              users={currUsers}
              openUserModal={toggleModal}
              currUserId={user?.id}
            />
          </Paper>

          <ActiveUserDisplay users={currUsers} currUserId={user?.id} openUserModal={toggleModal} />
        </Group>
      </form>
    </Center>
  );
}
