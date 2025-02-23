import { useState } from 'react';
import { Avatar, Group, SegmentedControl } from '@mantine/core';

interface AvatarSelectorProps {
  value: string;
  setValue: (value: string) => void;
}

export function AvatarSelector({ value, setValue }: AvatarSelectorProps) {
  const users = [
    '/avatarIcons/1504.png',
    '/avatarIcons/1619.png',
    '/avatarIcons/196.png',
    '/avatarIcons/44.png',
  ];

  return (
    <SegmentedControl
      value={value}
      onChange={setValue}
      data={users.map((user) => ({
        value: user,
        label: (
          <Group align="center" gap="xs">
            <Avatar radius="xl" size="sm" src={user} />
          </Group>
        ),
      }))}
    />
  );
}
