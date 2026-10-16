// Lernpfad: Phasen → Module → Lektionen als vertikaler Pfad.
import { curriculum, eintrag } from '../engine/content';
import type { LektionsStatus } from '../engine/freischaltung';
import { faelligeKarten } from '../progress/leitner';
import { heute } from '../progress/datum';
import { aktuelleStatus, zustand } from './app';
import { h } from './dom';

const STATUS_TEXT: Record<LektionsStatus, string> = {
  abgeschlossen: 'Abgeschlossen',
  aktuell: 'Als Nächstes',
  offen: 'Offen',
  gesperrt: 'Gesperrt',
};

const STATUS_ICON: Record<LektionsStatus, string> = {
  abgeschlossen: '✓',
  aktuell: '▶',
  offen: '○',
  gesperrt: '🔒',
};

export function pfadAnsicht(): HTMLElement {
  const status = aktuelleStatus();
  const f = zustand();
  const faellig = faelligeKarten(f, heute()).length;
  let aktuellesElement: HTMLElement | null = null;

  const phasen = curriculum.phasen.map((phase) => {
    const ids = phase.module.flatMap((m) => m.lektionen).filter((id) => status.has(id));
    const fertig = ids.filter((id) => status.get(id) === 'abgeschlossen').length;
    const anteil = ids.length ? fertig / ids.length : 0;

    const module = phase.module.map((modul) => {
      const knoten = modul.lektionen.filter((id) => status.has(id)).map((id, i) => {
        const e = eintrag(id)!;
        const st = status.get(id)!;
        const offen = st !== 'gesperrt';
        const inhalt = [
          h('span', { class: 'knoten-kreis', 'aria-hidden': 'true' }, STATUS_ICON[st]),
          h('span', { class: 'knoten-text' },
            h('span', { class: 'knoten-titel' }, e.lektion.titel),
            h('span', { class: 'knoten-meta' },
              `${STATUS_TEXT[st]} · ${e.lektion.dauerMinuten} Min.`,
              f.lektionen[id] ? ` · ${Math.round(f.lektionen[id].besteGenauigkeit * 100)} %` : ''),
          ),
        ];
        const el = offen
          ? h('a', { class: `knoten status-${st}`, href: `#/lektion/${id}`, 'data-seite': i % 2 }, inhalt)
          : h('div', { class: `knoten status-${st}`, 'aria-disabled': 'true', 'data-seite': i % 2 }, inhalt);
        if (st === 'aktuell') {
          el.setAttribute('aria-current', 'step');
          aktuellesElement = el;
        }
        return h('li', {}, el);
      });
      const geplant = (modul.geplant ?? []).map((t) =>
        h('li', {}, h('div', { class: 'knoten status-geplant', 'aria-disabled': 'true' },
          h('span', { class: 'knoten-kreis', 'aria-hidden': 'true' }, '…'),
          h('span', { class: 'knoten-text' }, h('span', { class: 'knoten-titel' }, t), h('span', { class: 'knoten-meta' }, 'In Vorbereitung')))));
      return h('section', { class: 'modul', 'aria-labelledby': `modul-${modul.id}` },
        h('h3', { class: 'modul-titel', id: `modul-${modul.id}` }, h('span', { class: 'modul-nr' }, modul.id), ' ', modul.titel),
        modul.beschreibung ? h('p', { class: 'modul-beschreibung' }, modul.beschreibung) : null,
        h('ol', { class: 'pfad' }, knoten, geplant),
      );
    });

    return h('section', { class: 'phase', id: `phase-${phase.nummer}` },
      h('header', { class: 'phase-kopf' },
        h('p', { class: 'phase-nr' }, `Phase ${phase.nummer}`),
        h('h2', {}, phase.titel),
        h('p', { class: 'phase-beschreibung' }, phase.beschreibung),
        ids.length
          ? h('div', { class: 'balken', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': ids.length, 'aria-valuenow': fertig, 'aria-label': `Phase ${phase.nummer}: ${fertig} von ${ids.length} Lektionen` },
              h('span', { style: `width:${anteil * 100}%` }))
          : null,
        h('p', { class: 'phase-stand' }, ids.length ? `${fertig} von ${ids.length} Lektionen` : 'Inhalte in Vorbereitung'),
      ),
      module,
    );
  });

  const ansicht = h('div', { class: 'ansicht pfad-ansicht' },
    faellig > 0
      ? h('a', { class: 'banner banner-wiederholen', href: '#/wiederholen' },
          h('span', { 'aria-hidden': 'true' }, '🔁 '), `${faellig} ${faellig === 1 ? 'Übung ist' : 'Übungen sind'} zur Wiederholung fällig`)
      : null,
    phasen,
  );
  if (aktuellesElement) {
    const el: HTMLElement = aktuellesElement;
    requestAnimationFrame(() => el.scrollIntoView({ block: 'center' }));
  }
  return ansicht;
}
