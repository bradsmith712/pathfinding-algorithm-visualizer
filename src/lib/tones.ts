import type { Tone } from '../data/algorithms';

/** Text color for an icon tone. */
export const TONE_TEXT: Record<Tone, string> = {
  blue: 'text-tone-blue',
  green: 'text-tone-green',
  yellow: 'text-tone-yellow',
  red: 'text-tone-red',
  violet: 'text-tone-violet',
};

/** Soft background behind an icon of this tone. */
export const TONE_SOFT_BG: Record<Tone, string> = {
  blue: 'bg-tone-blue/15',
  green: 'bg-tone-green/15',
  yellow: 'bg-tone-yellow/15',
  red: 'bg-tone-red/15',
  violet: 'bg-tone-violet/15',
};
