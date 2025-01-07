'use client';

import Link from 'next/link';
import {
  IconNumber100Small,
  IconSquareRoundedNumber0,
  IconSquareRoundedNumber1,
} from '@tabler/icons-react';
import { AppShell, Box, Burger, Group, Skeleton } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '@/components/Welcome/Welcome';

interface AppShellLayoutProps {
  children?: React.ReactNode;
  showWelcome?: boolean;
}

export function AppShellLayout({ children, showWelcome }: AppShellLayoutProps) {
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding="md"
      >
        <AppShell.Header>
          <Group h="100%" px="md">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconNumber100Small size={48} />
            <ColorSchemeToggle />
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Link href="/"> Home</Link>
          <Link href="/rotmg">ROTMG </Link>
          <Link href="/pr2">PR2</Link>
          <Link href="/mt">Minethings</Link>
        </AppShell.Navbar>
        <AppShell.Main>
          <Box>
            {showWelcome && <Welcome />}
            {children}
          </Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
