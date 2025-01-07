'use client';

import { IconMoon, IconSun } from '@tabler/icons-react';
import cx from 'clsx';
import { ActionIcon, useComputedColorScheme, useMantineColorScheme } from '@mantine/core';
import classes from './Demo.module.css';

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme('dark', { getInitialValueInEffect: true });

  return (
    <ActionIcon
      onClick={() => setColorScheme(computedColorScheme === 'dark' ? 'light' : 'dark')}
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
      ml="auto"
    >
      <IconSun className={cx(classes.icon, classes.light)} stroke={1.5} />
      <IconMoon className={cx(classes.icon, classes.dark)} stroke={1.5} />
    </ActionIcon>
  );
  // const { setColorScheme } = useMantineColorScheme();

  // return (
  //   <Group justify="center" align="baseline" ml="auto">
  //     <Button onClick={() => setColorScheme('light')}>Light</Button>
  //     <Button onClick={() => setColorScheme('dark')}>Dark</Button>
  //     <IconMoonStars onClick={() => setColorScheme('dark')} />
  //     {/* <Button onClick={() => setColorScheme('auto')}>Auto</Button> */}
  //   </Group>
  // );
}
