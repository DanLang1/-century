import { Button, Checkbox, Container, Group, TextInput } from '@mantine/core';

export function ChatBox() {
  const demoProps = {
    bg: 'var(--mantine-color-blue-light)',
    h: 100,
    mt: 'md',
  };
  return (
    <Container {...demoProps} size="lg">
      <TextInput
        // withAsterisk
        // label="Send Message"
        placeholder="chat"
        // key={form.key('email')}
        // {...form.getInputProps('email')}
      />
    </Container>
  );
}
