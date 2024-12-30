'use client';

import Link from 'next/link';
import { AppShell, Box, Burger } from '@mantine/core';
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
        navbar={{
          width: 150,
          breakpoint: 'sm',
          collapsed: { mobile: !opened },
        }}
        padding="md"
      >
        <AppShell.Header>
          <Box pl="md" pt="md">
            A century ago where pr2 was found
          </Box>

          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* <ColorSchemeToggle />  */}
        </AppShell.Header>

        <AppShell.Navbar p="md">
          <Link href="/"> Home</Link>
          <Link href="/rotmg">ROTMG </Link>
          <Link href="/pr2">PR2</Link>
          <Link href="/mt">Minethings</Link>
        </AppShell.Navbar>

        <AppShell.Main>
          {showWelcome && <Welcome />}
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
