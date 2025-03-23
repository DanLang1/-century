'use client';

import { Card, Center, Image, Text } from '@mantine/core';

export default function WaitConfirm() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder w="35vw">
      <Card.Section>
        <Image src="/jaden.png" height={160} alt="Norway" />
      </Card.Section>

      <Center mt="md" mb="xs">
        <Text fw={500}>Please check your email to confirm account</Text>
      </Center>
    </Card>
  );
}
