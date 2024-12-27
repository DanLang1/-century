import Image from 'next/image';
import { Box, Flex } from '@mantine/core';

export default function Page() {
  return (
    <Flex gap="md" wrap="wrap">
      <Image src="/Screenshot_100.png" width={600} height={480} alt="death screenshot" />
      <Image src="/Screenshot_103.png" width={600} height={480} alt="death screenshot" />
      <Image src="/Screenshot_104.png" width={600} height={480} alt="death screenshot" />
    </Flex>
  );
}
