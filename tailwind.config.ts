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
        tone: {
          blue: token('tone-blue'),
          green: token('tone-green'),
          yellow: token('tone-yellow'),
          red: token('tone-red'),
          violet: token('tone-violet'),
        },
        code: {
          keyword: token('code-keyword'),
          function: token('code-function'),
          number: token('code-number'),
        },
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
      keyframes: {
        'cell-visit': {
          '0%': { transform: 'scale(0.3)', borderRadius: '50%' },
          '60%': { transform: 'scale(1.1)', borderRadius: '20%' },
          '100%': { transform: 'scale(1)', borderRadius: '0' },
        },
        'cell-path': {
          '0%': { transform: 'scale(0.6)' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      animation: {
        'cell-visit': 'cell-visit 300ms ease-out',
        'cell-path': 'cell-path 250ms ease-out',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        control: 'var(--radius-control)',
      },
    },
  },
  plugins: [],
} satisfies Config;
