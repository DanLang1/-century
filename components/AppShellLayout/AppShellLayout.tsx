'use client';

import Link from 'next/link';
import { IconNumber100Small } from '@tabler/icons-react';
import { AppShell, Box, Burger, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';

interface AppShellLayoutProps {
  children?: React.ReactNode;
}

export function AppShellLayout({ children }: AppShellLayoutProps) {
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
            {/* <ProfileToggle /> */}
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Link href="/"> Home</Link>
          <Link href="/rotmg">ROTMG </Link>
          <Link href="/pr2">PR2</Link>
          <Link href="/mt">Minethings</Link>
        </AppShell.Navbar>
        <AppShell.Main>
          <Box>{children}</Box>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
