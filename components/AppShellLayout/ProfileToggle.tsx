'use client';

import { IconUser } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export function ProfileToggle() {
  return (
    <ActionIcon
      onClick={() =>
        notifications.show({
          title: `You're Stuck`,
          message: 'I havent made logout functionality yet 🐧',
        })
      }
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IconUser stroke={1.5} />
    </ActionIcon>
  );
}
