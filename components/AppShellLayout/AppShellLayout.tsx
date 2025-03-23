'use client';

import Link from 'next/link';
import { User } from '@supabase/supabase-js';
import { IconNumber100Small } from '@tabler/icons-react';
import { AppShell, Burger, Button, Group, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { ColorSchemeToggle } from '@/components/ColorSchemeToggle/ColorSchemeToggle';
import { ProfileToggle } from './ProfileToggle';
import classes from './AppShellLayout.module.css';

interface AppShellLayoutProps {
  children?: React.ReactNode;
  user: User | null;
}

export function AppShellLayout({ children, user }: AppShellLayoutProps) {
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [opened, { toggle }] = useDisclosure();
  return (
    <>
      <AppShell
        header={{ height: 60 }}
        navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        padding={{ base: 'sm', sm: 'sm', lg: 'xl' }} // Top and bottom padding
      >
        <AppShell.Header>
          <Group h="100%" px="sm">
            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
            <IconNumber100Small size={48} />
            <ColorSchemeToggle />

            {user ? (
              user.is_anonymous ? (
                <Link href="/login/registerTempUser">
                  <Button variant="transparent" size="md">
                    Create Perm Account
                  </Button>
                </Link>
              ) : (
                <ProfileToggle />
              )
            ) : (
              <>
                <Link href="/login">
                  <Button variant="transparent" size="md" className={classes.login}>
                    Login
                  </Button>
                </Link>
                <Link href="/login?type=register">
                  <Button
                    variant="default"
                    size="md"
                    visibleFrom="sm"
                    className={classes.loginBorder}
                  >
                    Signup
                  </Button>
                </Link>
              </>
            )}

            {/* <ProfileToggle /> */}
          </Group>
        </AppShell.Header>
        <AppShell.Navbar p="md">
          <Link href="/"> Home</Link>
          <Link href="/rotmg">ROTMG </Link>
          <Link href="/pr2">PR2</Link>
          <Link href="/mt">Minethings</Link>
        </AppShell.Navbar>
        <AppShell.Main
          pl={isMobile ? 0 : undefined}
          pr={isMobile ? 0 : undefined}
          pb={isMobile ? 0 : undefined}
        >
          {children}
        </AppShell.Main>
      </AppShell>
    </>
  );
}
