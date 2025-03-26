import { Box, Group, Text } from '@mantine/core';
import classes from './Chat.module.css';

interface TypingIndicatorProps {
  usersTyping: string[];
}

export function TypingIndicator({ usersTyping }: TypingIndicatorProps) {
  return (
    <Box h="1em">
      {usersTyping.length > 0 && (
        <Group gap="2px" mb="xl" align="center">
          <Text c="dimmed" size="sm">
            {`${usersTyping.join(', ')} is typing`}
          </Text>
          <span className={classes.dots}>
            {[0, 1, 2].map((i) => (
              <span key={i} className={classes.dot}>
                .
              </span>
            ))}
          </span>
        </Group>
      )}
    </Box>
  );
}
