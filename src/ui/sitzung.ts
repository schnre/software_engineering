// Darstellung einer laufenden Sitzung (Lektion oder Wiederholung): Schritt, Prüfen, Feedback, Weiter.
import { Sitzung } from '../engine/session';
import { uebungErzeugen, type UebungsInstanz } from '../exercises';
import { TYP_NAMEN } from '../exercises';
import type { Antwort } from '../progress/aktionen';
import type { Schritt } from '../types';
import { anhaengen, h, leeren } from './dom';
import { md } from './markdown';

export interface SitzungsElement {
  schritt: Schritt;
  schluessel: string;
  herkunft?: string; // z. B. Lektionstitel in der Wiederholung
}

export interface SitzungsOptionen {
  titel: string;
  elemente: SitzungsElement[];
  maxWiederholungen: number;
  /** Wird aufgerufen, wenn alle Schritte erledigt sind. Füllt den Inhaltsbereich selbst. */
  abschluss: (antworten: Antwort[], buehne: HTMLElement) => void;
  abbrechen: () => void;
}

const LOB = ['Richtig!', 'Genau!', 'Stark!', 'Sehr gut!', 'Korrekt!'];

export function sitzungAnsicht(opt: SitzungsOptionen): HTMLElement {
  const sitzung = new Sitzung(opt.elemente, opt.maxWiederholungen);
  let instanz: UebungsInstanz | null = null;
  let geprueft = false;

  const balken = h('span', {});
  const fortschritt = h('div', { class: 'balken sitzung-balken', role: 'progressbar', 'aria-label': 'Fortschritt der Lektion', 'aria-valuemin': 0, 'aria-valuemax': 100 }, balken);
  const schliessen = h('button', { type: 'button', class: 'knopf-icon', 'aria-label': 'Sitzung beenden', onClick: () => {
    if (sitzung.fertig || confirm('Sitzung wirklich beenden? Der Fortschritt dieser Lektion geht verloren.')) opt.abbrechen();
  } }, '✕');
  const kopf = h('header', { class: 'sitzung-kopf' }, schliessen, fortschritt);

  const buehne = h('div', { class: 'sitzung-buehne', tabindex: -1 });
  const feedback = h('section', { class: 'feedback', role: 'status', 'aria-live': 'polite', hidden: true });
  const hauptKnopf = h('button', { type: 'button', class: 'knopf knopf-primaer knopf-gross' }, 'Prüfen');
  const tippKnopf = h('button', { type: 'button', class: 'knopf knopf-text', hidden: true }, '💡 Tipp');
  const fuss = h('footer', { class: 'sitzung-fuss' }, tippKnopf, hauptKnopf);
  const wurzel = h('div', { class: 'sitzung' }, kopf, buehne, feedback, fuss);

  function knopfAktualisieren() {
    if (!instanz) return;
    if (geprueft || !instanz.interaktiv) {
      hauptKnopf.textContent = 'Weiter';
      hauptKnopf.disabled = false;
    } else {
      hauptKnopf.textContent = 'Prüfen';
      hauptKnopf.disabled = !instanz.bereit();
    }
  }

  function balkenSetzen() {
    const p = Math.round(sitzung.fortschritt * 100);
    balken.style.width = `${p}%`;
    fortschritt.setAttribute('aria-valuenow', String(p));
  }

  function schrittZeigen() {
    balkenSetzen();
    leeren(buehne);
    feedback.hidden = true;
    feedback.className = 'feedback';
    leeren(feedback);
    geprueft = false;
    const element = sitzung.aktuell;
    if (!element) {
      instanz = null;
      fuss.hidden = true;
      kopf.hidden = true;
      const antworten: Antwort[] = [...sitzung.ersterVersuch.entries()].map(([i, korrekt]) => ({
        schluessel: opt.elemente[i].schluessel,
        korrekt,
      }));
      opt.abschluss(antworten, buehne);
      buehne.focus();
      return;
    }
    instanz = uebungErzeugen(element.schritt, knopfAktualisieren);
    const typ = element.schritt.typ;
    buehne.append(
      h('p', { class: 'schritt-typ' },
        TYP_NAMEN[typ],
        sitzung.istWiederholung ? h('span', { class: 'etikett etikett-warnung' }, '↻ Nochmals') : null,
        element.herkunft ? h('span', { class: 'etikett' }, element.herkunft) : null),
      instanz.element,
    );
    const hinweis = element.schritt.hinweis;
    tippKnopf.hidden = !hinweis || !instanz.interaktiv;
    tippKnopf.onclick = () => {
      if (!hinweis) return;
      tippKnopf.hidden = true;
      instanz!.element.append(h('aside', { class: 'tipp', html: `<strong>Tipp:</strong> ${md(hinweis).replace(/^<p>|<\/p>$/g, '')}` }));
    };
    knopfAktualisieren();
    buehne.focus({ preventScroll: true });
    window.scrollTo({ top: 0 });
  }

  function pruefen() {
    if (!instanz || !sitzung.aktuell) return;
    const schritt = sitzung.aktuell.schritt;
    const ergebnis = instanz.pruefen();
    const wirdWiederholt = !ergebnis.korrekt && !sitzung.istWiederholung && opt.maxWiederholungen > 0;
    sitzung.beantworten(ergebnis.korrekt);
    geprueft = true;
    tippKnopf.hidden = true;
    const erklaerung = 'erklaerung' in schritt && typeof schritt.erklaerung === 'string' ? schritt.erklaerung : '';
    feedback.className = `feedback ${ergebnis.korrekt ? 'feedback-richtig' : 'feedback-falsch'}`;
    leeren(feedback);
    anhaengen(feedback, [
      h('h2', { class: 'feedback-titel', tabindex: -1 },
        h('span', { class: 'feedback-icon', 'aria-hidden': 'true' }, ergebnis.korrekt ? '✓' : '✗'),
        ergebnis.korrekt ? LOB[Math.floor(Math.random() * LOB.length)] : 'Nicht ganz.'),
      ergebnis.loesung ? h('div', { class: 'feedback-loesung' }, h('strong', {}, 'Richtig wäre: '), h('div', { html: ergebnis.loesung })) : null,
      erklaerung ? h('div', { class: 'feedback-text', html: md(erklaerung) }) : null,
      ergebnis.details?.length ? h('details', { class: 'feedback-details', open: !ergebnis.korrekt },
        h('summary', {}, 'Warum die einzelnen Optionen richtig oder falsch sind'),
        h('ul', {}, ergebnis.details.map((d) => h('li', { html: d })))) : null,
      wirdWiederholt ? h('p', { class: 'feedback-hinweis' }, '↻ Diese Übung kommt am Ende nochmals – lies die Erklärung in Ruhe.') : null,
    ]);
    feedback.hidden = false;
    knopfAktualisieren();
    (feedback.querySelector('.feedback-titel') as HTMLElement).focus({ preventScroll: true });
    feedback.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function hauptAktion() {
    if (!instanz) return;
    if (instanz.interaktiv && !geprueft) {
      if (instanz.bereit()) pruefen();
      return;
    }
    sitzung.weiter();
    schrittZeigen();
  }

  hauptKnopf.addEventListener('click', hauptAktion);

  function tastatur(e: KeyboardEvent) {
    if (!wurzel.isConnected) {
      document.removeEventListener('keydown', tastatur);
      return;
    }
    if (e.ctrlKey || e.metaKey || e.altKey || !instanz) return;
    const ziel = e.target as HTMLElement;
    const inEingabe = ziel instanceof HTMLInputElement || ziel instanceof HTMLTextAreaElement;
    if (e.key === 'Enter') {
      if (ziel instanceof HTMLButtonElement && ziel !== hauptKnopf) return; // Knopf selbst auslösen lassen
      if (ziel instanceof HTMLAnchorElement || ziel.tagName === 'SUMMARY') return;
      e.preventDefault();
      hauptAktion();
      return;
    }
    if (!inEingabe && !geprueft && instanz.taste?.(e.key)) e.preventDefault();
  }
  document.addEventListener('keydown', tastatur);

  schrittZeigen();
  return wurzel;
}
