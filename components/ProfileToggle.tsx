'use client';

import { IconUser } from '@tabler/icons-react';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';

export function ProfileToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IconUser stroke={1.5} />
    </ActionIcon>
  );
}
