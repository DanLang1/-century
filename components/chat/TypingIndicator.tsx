import { Avatar, Group, Loader, Tooltip } from '@mantine/core';
import { UserInfo } from './chat.interfaces';
import { TypingIndicatorDots } from './TypingIndicatorDots';

interface TypingIndicatorProps {
  usersTyping: UserInfo[];
}

export function TypingIndicator({ usersTyping }: TypingIndicatorProps) {
  return (
    <>
      {usersTyping.length > 0 && (
        <Group gap="2px" align="center">
          <Avatar.Group>
            {usersTyping.map((user) => (
              <Tooltip key={user.id} label={user.username} withArrow>
                <Avatar radius="xl" size="md" src={user.avatar} />
              </Tooltip>
            ))}
          </Avatar.Group>

          <Loader loaders={{ ...Loader.defaultLoaders, ring: TypingIndicatorDots }} type="ring" />
        </Group>
      )}
    </>
  );
}
