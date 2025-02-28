import { Avatar, Group, SegmentedControl } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { User } from './ChatBoxAbly';

interface AvatarSelectorProps {
  form: UseFormReturnType<User>;
}

export function AvatarSelector({ form }: AvatarSelectorProps) {
  const users = [
    '/avatarIcons/1504.png',
    '/avatarIcons/1619.png',
    '/avatarIcons/196.png',
    '/avatarIcons/44.png',
  ];

  return (
    <SegmentedControl
      key={form.key('avatar')}
      {...form.getInputProps('avatar')}
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
