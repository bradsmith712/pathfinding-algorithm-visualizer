export type TokenKind = 'keyword' | 'function' | 'number' | 'plain';

export interface Token {
  text: string;
  kind: TokenKind;
}

/** Pseudo-code keywords colored like the reference screenshot. */
const KEYWORDS = new Set([
  'function',
  'while',
  'if',
  'for',
  'each',
  'in',
  'not',
  'is',
  'return',
  'continue',
  'and',
  'or',
  'as',
  'mark',
]);

// Identifiers may end in "*" so "A*(start, goal)" reads as a function name.
const TOKEN = /([A-Za-z_][A-Za-z0-9_]*\*?)|(\d+)|([^A-Za-z_\d]+)/g;

/**
 * Splits one line of pseudo-code into colored tokens: keywords, function
 * calls (an identifier directly followed by "("), numbers, and everything else.
 * Adjacent plain text is merged so lines render as few spans as possible.
 */
export function highlightLine(line: string): Token[] {
  const tokens: Token[] = [];
  const push = (text: string, kind: TokenKind) => {
    const last = tokens.at(-1);
    if (kind === 'plain' && last?.kind === 'plain') last.text += text;
    else tokens.push({ text, kind });
  };

  for (const match of line.matchAll(TOKEN)) {
    const [text, word, number] = match;
    const end = (match.index ?? 0) + text.length;
    if (word !== undefined) {
      if (KEYWORDS.has(word)) push(word, 'keyword');
      else if (line[end] === '(') push(word, 'function');
      else push(word, 'plain');
    } else if (number !== undefined) {
      push(number, 'number');
    } else {
      push(text, 'plain');
    }
  }
  return tokens;
}
