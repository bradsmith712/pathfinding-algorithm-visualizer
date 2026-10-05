import type { Config } from 'tailwindcss';

const token = (name: string) => `rgb(var(--color-${name}) / <alpha-value>)`;

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        bg: token('bg'),
        surface: token('surface'),
        'surface-raised': token('surface-raised'),
        border: token('border'),
        fg: token('fg'),
        muted: token('muted'),
        accent: token('accent'),
        'accent-fg': token('accent-fg'),
        cell: {
          empty: token('cell-empty'),
          line: token('cell-line'),
          wall: token('cell-wall'),
          start: token('cell-start'),
          end: token('cell-end'),
          visited: token('cell-visited'),
          'visited-recent': token('cell-visited-recent'),
          path: token('cell-path'),
          current: token('cell-current'),
        },
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
    },
  },
  plugins: [],
} satisfies Config;
