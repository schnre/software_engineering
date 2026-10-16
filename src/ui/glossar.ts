// Glossar: wird automatisch aus den "begriffe" aller Lektionen aufgebaut.
import { lernpfad } from '../engine/content';
import { h, leeren } from './dom';
import { inline } from './markdown';

interface Eintrag {
  begriff: string;
  englisch?: string;
  erklaerung: string;
  lektionId: string;
  lektionTitel: string;
}

function eintraege(): Eintrag[] {
  const liste: Eintrag[] = [];
  const gesehen = new Set<string>();
  for (const { lektion } of lernpfad) {
    for (const b of lektion.begriffe ?? []) {
      const key = b.begriff.toLowerCase();
      if (gesehen.has(key)) continue; // erstes Auftreten gewinnt
      gesehen.add(key);
      liste.push({ ...b, lektionId: lektion.id, lektionTitel: lektion.titel });
    }
  }
  return liste.sort((a, b) => a.begriff.localeCompare(b.begriff, 'de-CH'));
}

export function glossarAnsicht(): HTMLElement {
  const alle = eintraege();
  const suche = h('input', { type: 'search', id: 'glossar-suche', class: 'suchfeld', placeholder: 'Begriff suchen …', autocomplete: 'off' });
  const liste = h('dl', { class: 'glossar' });
  const zaehler = h('p', { class: 'hinweis-klein', role: 'status' });

  function zeichnen() {
    const q = suche.value.trim().toLowerCase();
    const treffer = alle.filter((e) => !q || `${e.begriff} ${e.englisch ?? ''} ${e.erklaerung}`.toLowerCase().includes(q));
    leeren(liste);
    zaehler.textContent = `${treffer.length} ${treffer.length === 1 ? 'Begriff' : 'Begriffe'}`;
    for (const e of treffer) {
      liste.append(
        h('dt', {}, e.begriff, e.englisch ? h('span', { class: 'englisch' }, ` (${e.englisch})`) : null),
        h('dd', {}, h('span', { html: inline(e.erklaerung) }), ' ',
          h('a', { class: 'quelle', href: `#/lektion/${e.lektionId}` }, `→ ${e.lektionTitel}`)),
      );
    }
  }
  suche.addEventListener('input', zeichnen);
  zeichnen();

  return h('div', { class: 'ansicht' },
    h('h1', {}, 'Glossar'),
    h('p', { class: 'einleitung' }, 'Alle Fachbegriffe aus den Lektionen, mit englischem Originalbegriff.'),
    h('label', { for: 'glossar-suche', class: 'label' }, 'Suche'), suche, zaehler, liste);
}
