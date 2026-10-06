import { highlightLine, type TokenKind } from '../lib/highlight';

const TOKEN_CLASSES: Record<TokenKind, string> = {
  keyword: 'text-code-keyword',
  function: 'text-code-function',
  number: 'text-code-number',
  plain: '',
};

interface PseudoCodeProps {
  lines: readonly string[];
}

/**
 * Line-numbered, syntax-colored pseudo-code. Flows into two columns when
 * there's room; long lines wrap with a hanging indent under their own text.
 */
export function PseudoCode({ lines }: PseudoCodeProps) {
  return (
    <section
      aria-labelledby="pseudo-code-heading"
      className="rounded-card border border-border bg-surface p-5"
    >
      <h2 id="pseudo-code-heading" className="text-lg font-semibold">
        Pseudo-code
      </h2>
      <ol className="mt-3 font-mono text-xs leading-5 md:columns-2 md:gap-6">
        {lines.map((line, i) => {
          const indent = line.length - line.trimStart().length;
          return (
            <li key={i} className="flex break-inside-avoid gap-2.5 py-px">
              <span
                aria-hidden="true"
                className="w-5 shrink-0 select-none text-right text-muted/70"
              >
                {i + 1}
              </span>
              <code
                className="min-w-0 whitespace-pre-wrap break-words"
                style={{ paddingLeft: `${indent + 2}ch`, textIndent: '-2ch' }}
              >
                {line.trim() === ''
                  ? ' '
                  : highlightLine(line.trimStart()).map((token, j) => (
                      <span key={j} className={TOKEN_CLASSES[token.kind]}>
                        {token.text}
                      </span>
                    ))}
              </code>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
