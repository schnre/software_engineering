// Sehr kleines Markdown: Absätze, Aufzählungen, `Code`, **fett**, *kursiv*.
// Eingaben werden immer zuerst escaped – Lektionen können kein HTML einschleusen.
import { escapeHtml } from './dom';

export function inline(text: string): string {
  return text
    .split('`')
    .map((teil, i) => {
      const e = escapeHtml(teil);
      if (i % 2 === 1) return `<code>${e}</code>`;
      return e
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/(^|[^*])\*([^*\s][^*]*)\*/g, '$1<em>$2</em>');
    })
    .join('');
}

export function md(text: string): string {
  return text
    .trim()
    .split(/\n\s*\n/)
    .map((block) => {
      const zeilen = block.split('\n');
      if (zeilen.every((z) => /^\s*[-•] /.test(z))) {
        return `<ul>${zeilen.map((z) => `<li>${inline(z.replace(/^\s*[-•] /, ''))}</li>`).join('')}</ul>`;
      }
      if (zeilen.every((z) => /^\s*\d+\. /.test(z))) {
        return `<ol>${zeilen.map((z) => `<li>${inline(z.replace(/^\s*\d+\. /, ''))}</li>`).join('')}</ol>`;
      }
      return `<p>${zeilen.map(inline).join('<br>')}</p>`;
    })
    .join('');
}
