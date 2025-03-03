import { Avatar, Group, SegmentedControl } from '@mantine/core';
import { UseFormReturnType } from '@mantine/form';
import { UserForm } from './chat.interfaces';

interface AvatarSelectorProps {
  form: UseFormReturnType<UserForm>;
}

export function AvatarSelector({ form }: AvatarSelectorProps) {
  const avatars = [
    '/avatarIcons/1504.png',
    '/avatarIcons/1619.png',
    '/avatarIcons/196.png',
    '/avatarIcons/44.png',
    '/avatarIcons/1.png',
    '/avatarIcons/2.png',
    '/avatarIcons/3.png',
    '/avatarIcons/4.png',
    '/avatarIcons/5.png',
    '/avatarIcons/6.png',
    '/avatarIcons/7.png',
    '/avatarIcons/8.png',
    '/avatarIcons/9.png',
    '/avatarIcons/10.png',
    '/avatarIcons/11.png',
    '/avatarIcons/12.png',
  ];

  return (
    <SegmentedControl
      color="gray"
      fullWidth
      withItemsBorders={false}
      styles={{
        root: {
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr 1fr',
          justifyItems: 'center',
          alignItems: 'center',
        },
        indicator: {},
      }}
      key={form.key('avatar')}
      {...form.getInputProps('avatar')}
      data={avatars.map((avatar) => ({
        value: avatar,
        label: (
          <Group align="center" gap="xs">
            <Avatar radius="xl" size="sm" src={avatar} />
          </Group>
        ),
      }))}
    />
  );
}
