import { describe, expect, it } from 'vitest';
import { md } from '../src/ui/markdown';

describe('Markdown', () => {
  it('rendert Codeblöcke mit Hervorhebung und escaped den Inhalt', () => {
    const html = md('Vorher\n\n```\ntemplate <typename T>\nT x = a < b;\n```\n\nNachher');
    expect(html).toContain('<div class="code-figur md-code">');
    expect(html).toContain('tok-kw');
    expect(html).toContain('a &lt; b;');
    expect(html).not.toContain('<typename');
    expect(html).not.toContain('```');
    expect(html.match(/class="zeile"/g)).toHaveLength(2);
    expect(html).toContain('<p>Nachher</p>');
  });

  it('lässt Aufzählungen und Absätze unverändert', () => {
    expect(md('- a\n- b')).toBe('<ul><li>a</li><li>b</li></ul>');
    expect(md('**fett** und `code`')).toBe('<p><strong>fett</strong> und <code>code</code></p>');
  });
});
