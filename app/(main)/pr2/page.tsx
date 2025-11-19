import Image from 'next/image';
import { Flex } from '@mantine/core';

export default function Page() {
  return (
    <>
      <div>Pr2 screenshots from All Time Best</div>
      <Flex gap="md" wrap="wrap">
        <Image src="images/pr2/Screenshot_105.png" width={1583} height={58} alt="pr2 screenshot" />
        <Image src="images/pr2/Screenshot_106.png" width={2294} height={415} alt="pr2 screenshot" />
        <Image src="images/pr2/Screenshot_107.png" width={2294} height={415} alt="pr2 screenshot" />
        <Image src="images/pr2/Screenshot_108.png" width={2294} height={415} alt="pr2 screenshot" />
        <Image src="images/pr2/Screenshot_109.png" width={2294} height={560} alt="pr2 screenshot" />
      </Flex>
    </>
  );
}
