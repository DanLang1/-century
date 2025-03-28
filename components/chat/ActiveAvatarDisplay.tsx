import { Avatar, Tooltip, UnstyledButton } from '@mantine/core';
import { UserInfo } from './chat.interfaces';

interface ActiveAvatarDisplay {
  users: UserInfo[];
  openDrawer: () => void;
}

export function ActiveAvatarDisplay({ users, openDrawer }: ActiveAvatarDisplay) {
  return (
    <Tooltip.Group openDelay={300} closeDelay={100}>
      <UnstyledButton onClick={openDrawer}>
        <Avatar.Group>
          {users.map((user) => (
            <Tooltip key={user.id} label={user.username} withArrow>
              <Avatar radius="xl" size="md" src={user.avatar} />
            </Tooltip>
          ))}
        </Avatar.Group>
      </UnstyledButton>
    </Tooltip.Group>
  );
}
