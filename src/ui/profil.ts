// Profil: Level, Statistik, Aktivität, Einstellungen, Export/Import.
import { lernpfad } from '../engine/content';
import { heute, plusTage } from '../progress/datum';
import { exportDateiname, exportText, importText } from '../progress/export';
import { speicherVerfuegbar } from '../progress/speicher';
import { streakHeute } from '../progress/streak';
import { LEVELS, levelFuer } from '../progress/xp';
import { leererFortschritt, type Thema } from '../progress/zustand';
import { aendern, ersetzen, themaAnwenden, zustand } from './app';
import { h } from './dom';

const WOCHEN = 12;

function aktivitaetsRaster(akt: Record<string, number>): HTMLElement {
  const tag = heute();
  const tage: string[] = [];
  for (let i = WOCHEN * 7 - 1; i >= 0; i--) tage.push(plusTage(tag, -i));
  const aktiv = tage.filter((t) => (akt[t] ?? 0) > 0).length;
  return h('figure', { class: 'aktivitaet' },
    h('div', { class: 'aktivitaet-raster', role: 'img', 'aria-label': `An ${aktiv} der letzten ${WOCHEN * 7} Tage gelernt` },
      tage.map((t) => {
        const xp = akt[t] ?? 0;
        const stufe = xp === 0 ? 0 : xp < 10 ? 1 : xp < 25 ? 2 : 3;
        return h('span', { class: `tag stufe-${stufe}`, title: `${new Date(t).toLocaleDateString('de-CH')}: ${xp} XP` });
      })),
    h('figcaption', {}, `${aktiv} aktive Tage in den letzten ${WOCHEN} Wochen`));
}

export function profilAnsicht(): HTMLElement {
  const f = zustand();
  const lvl = levelFuer(f.xp);
  const fertig = lernpfad.filter((e) => f.lektionen[e.lektion.id]).length;
  const meldung = h('p', { class: 'meldung', role: 'status' });

  const themaWahl = h('div', { class: 'segment', role: 'radiogroup', 'aria-label': 'Farbschema' },
    (['system', 'hell', 'dunkel'] as Thema[]).map((t) =>
      h('button', {
        type: 'button', role: 'radio', class: 'segment-knopf', 'aria-checked': String(f.einstellungen.thema === t),
        onClick: (e: Event) => {
          aendern((fs) => { fs.einstellungen.thema = t; });
          themaAnwenden();
          themaWahl.querySelectorAll('button').forEach((b) => b.setAttribute('aria-checked', String(b === e.currentTarget)));
        },
      }, t === 'system' ? 'System' : t === 'hell' ? 'Hell' : 'Dunkel')));

  const erkunden = h('input', { type: 'checkbox', id: 'erkunden', checked: f.einstellungen.erkunden });
  erkunden.addEventListener('change', () => aendern((fs) => { fs.einstellungen.erkunden = erkunden.checked; }));

  const datei = h('input', { type: 'file', accept: 'application/json,.json', class: 'versteckt', id: 'import-datei' });
  datei.addEventListener('change', async () => {
    const file = datei.files?.[0];
    if (!file) return;
    try {
      const neu = importText(await file.text());
      if (!confirm('Den aktuellen Fortschritt durch die importierte Datei ersetzen?')) return;
      ersetzen(neu);
      themaAnwenden();
      meldung.textContent = '✓ Fortschritt importiert.';
      location.hash = '#/profil?i=' + Date.now();
    } catch (e) {
      meldung.textContent = `✗ Import fehlgeschlagen: ${e instanceof Error ? e.message : String(e)}`;
    } finally {
      datei.value = '';
    }
  });

  function exportieren() {
    const blob = new Blob([exportText(zustand())], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = h('a', { href: url, download: exportDateiname() });
    document.body.append(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    meldung.textContent = '✓ Export erstellt.';
  }

  function zuruecksetzen() {
    if (!confirm('Allen Fortschritt löschen? Das kann nicht rückgängig gemacht werden. Exportiere ihn vorher, wenn du ihn behalten willst.')) return;
    ersetzen(leererFortschritt());
    themaAnwenden();
    location.hash = '#/';
  }

  return h('div', { class: 'ansicht' },
    h('h1', {}, 'Profil'),
    !speicherVerfuegbar() ? h('p', { class: 'banner banner-warnung' }, '⚠ Der Browser-Speicher ist nicht verfügbar. Dein Fortschritt geht beim Schliessen verloren – nutze den Export.') : null,
    h('section', { class: 'karte level-karte' },
      h('p', { class: 'phase-nr' }, 'Level'),
      h('h2', {}, lvl.level.name),
      h('p', {}, lvl.level.beschreibung),
      h('div', { class: 'balken', role: 'progressbar', 'aria-label': 'Fortschritt zum nächsten Level', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(lvl.anteil * 100) },
        h('span', { style: `width:${lvl.anteil * 100}%` })),
      h('ol', { class: 'level-leiter' }, LEVELS.map((l, i) =>
        h('li', { class: i <= lvl.index ? 'erreicht' : '' }, h('strong', {}, l.name), ` ab ${l.ab} XP`))),
    ),
    h('dl', { class: 'kacheln' },
      h('div', { class: 'kachel' }, h('dt', {}, 'XP gesamt'), h('dd', {}, String(f.xp))),
      h('div', { class: 'kachel' }, h('dt', {}, 'Lektionen'), h('dd', {}, `${fertig} / ${lernpfad.length}`)),
      h('div', { class: 'kachel' }, h('dt', {}, 'Streak'), h('dd', {}, `🔥 ${streakHeute(f.streak, heute())}`)),
      h('div', { class: 'kachel' }, h('dt', {}, 'Längster Streak'), h('dd', {}, String(f.streak.laengste))),
    ),
    h('section', { class: 'karte' }, h('h2', {}, 'Aktivität'), aktivitaetsRaster(f.aktivitaet)),
    h('section', { class: 'karte' },
      h('h2', {}, 'Einstellungen'),
      h('p', { class: 'label' }, 'Farbschema'), themaWahl,
      h('div', { class: 'schalter' }, erkunden,
        h('label', { for: 'erkunden' }, h('strong', {}, 'Erkundungsmodus'), h('br'),
          h('span', { class: 'hinweis-klein' }, 'Alle Lektionen freischalten, z. B. wenn du ein Thema schon kennst.'))),
    ),
    h('section', { class: 'karte' },
      h('h2', {}, 'Fortschritt sichern'),
      h('p', {}, 'Dein Fortschritt liegt nur in diesem Browser. Es gibt keine Konten und keine Tracker. Mit Export und Import überträgst du ihn auf ein anderes Gerät.'),
      h('div', { class: 'knopf-reihe' },
        h('button', { type: 'button', class: 'knopf knopf-sekundaer', onClick: exportieren }, '⬇ Exportieren'),
        h('label', { for: 'import-datei', class: 'knopf knopf-sekundaer', tabindex: 0, role: 'button',
          onKeydown: (e: KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); datei.click(); } } }, '⬆ Importieren'),
        datei),
      meldung,
      h('button', { type: 'button', class: 'knopf knopf-gefahr', onClick: zuruecksetzen }, 'Fortschritt zurücksetzen'),
    ),
  );
}
