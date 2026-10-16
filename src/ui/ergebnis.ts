// Ergebnis-Screen nach einer Lektion oder Wiederholung.
import type { Ergebnis } from '../progress/aktionen';
import { levelFuer } from '../progress/xp';
import { zustand } from './app';
import { h } from './dom';

export interface ErgebnisAktion {
  text: string;
  href: string;
  primaer?: boolean;
}

export function ergebnisAnsicht(titel: string, e: Ergebnis, aktionen: ErgebnisAktion[], zusatz: (HTMLElement | null)[] = []): HTMLElement {
  const lvl = levelFuer(zustand().xp);
  const prozent = Math.round(e.genauigkeit * 100);
  return h('div', { class: 'ergebnis' },
    h('div', { class: 'ergebnis-symbol', 'aria-hidden': 'true' }, e.fehlerfrei ? '🏆' : '🎉'),
    h('h1', {}, titel),
    e.fehlerfrei ? h('p', { class: 'ergebnis-lob' }, 'Fehlerfrei – stark!') : null,
    e.levelAufstieg ? h('p', { class: 'banner banner-level' }, `⬆ Neues Level erreicht: ${e.levelAufstieg}`) : null,
    h('dl', { class: 'kacheln' },
      h('div', { class: 'kachel' }, h('dt', {}, 'XP'), h('dd', {}, `+${e.xp}`)),
      h('div', { class: 'kachel' }, h('dt', {}, 'Genauigkeit'), h('dd', {}, `${prozent} %`)),
      h('div', { class: 'kachel' }, h('dt', {}, 'Streak'), h('dd', {}, `🔥 ${e.streak} ${e.streak === 1 ? 'Tag' : 'Tage'}`)),
      e.gemeistert ? h('div', { class: 'kachel' }, h('dt', {}, 'Gemeistert'), h('dd', {}, `⭐ ${e.gemeistert}`)) : null,
    ),
    h('div', { class: 'level-fortschritt' },
      h('p', {}, h('strong', {}, lvl.level.name), lvl.naechstes ? ` · noch ${lvl.naechstes.ab - zustand().xp} XP bis ${lvl.naechstes.name}` : ' · höchstes Level'),
      h('div', { class: 'balken', role: 'progressbar', 'aria-label': 'Fortschritt zum nächsten Level', 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(lvl.anteil * 100) },
        h('span', { style: `width:${lvl.anteil * 100}%` })),
    ),
    !e.fehlerfrei ? h('p', { class: 'hinweis-klein' }, '🔁 Falsch beantwortete Übungen liegen jetzt in deiner Wiederholungs-Box.') : null,
    zusatz,
    h('div', { class: 'knopf-reihe' },
      aktionen.map((a) => h('a', { class: `knopf ${a.primaer ? 'knopf-primaer' : 'knopf-sekundaer'} knopf-gross`, href: a.href }, a.text))),
  );
}
