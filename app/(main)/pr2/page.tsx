import Image from 'next/image';
import { Flex } from '@mantine/core';

export default function Page() {
  return (
    <>
      <div>Pr2 screenshots from All Time Best</div>
      <Flex gap="md" wrap="wrap">
        <Image src="/Screenshot_105.png" width={1583} height={58} alt="death screenshot" />
        <Image src="/Screenshot_106.png" width={2294} height={415} alt="death screenshot" />
        <Image src="/Screenshot_107.png" width={2294} height={415} alt="death screenshot" />
        <Image src="/Screenshot_108.png" width={2294} height={415} alt="death screenshot" />
        <Image src="/Screenshot_109.png" width={2294} height={560} alt="death screenshot" />
      </Flex>
    </>
  );
}
