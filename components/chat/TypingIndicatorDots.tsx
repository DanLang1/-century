import { forwardRef } from 'react';
import { MantineLoaderComponent } from '@mantine/core';

export const TypingIndicatorDots: MantineLoaderComponent = forwardRef(
  ({ style, ...others }, ref) => (
    <svg
      {...others}
      ref={ref}
      style={{
        width: 'var(--loader-size, 20px)',
        height: 'var(--loader-size, 20px)',
        fill: 'var(--loader-color, #fff)',
        ...style,
      }}
      viewBox="0 0 50 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="10" cy="10" r="4">
        <animate attributeName="r" values="4;6;4" dur="1.2s" repeatCount="indefinite" begin="0s" />
      </circle>
      <circle cx="25" cy="10" r="4">
        <animate
          attributeName="r"
          values="4;6;4"
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.2s"
        />
      </circle>
      <circle cx="40" cy="10" r="4">
        <animate
          attributeName="r"
          values="4;6;4"
          dur="1.2s"
          repeatCount="indefinite"
          begin="0.4s"
        />
      </circle>
    </svg>
  )
);
