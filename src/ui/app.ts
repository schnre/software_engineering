// Zentraler App-Zustand: Fortschritt im Speicher halten und nach Änderungen speichern.
import { lernpfad } from '../engine/content';
import { statusListe, type LektionsStatus } from '../engine/freischaltung';
import { laden, speichern } from '../progress/speicher';
import type { Fortschritt } from '../progress/zustand';

let fortschritt: Fortschritt = laden();
const beobachter = new Set<() => void>();

export function zustand(): Fortschritt {
  return fortschritt;
}

/** Fortschritt ändern, speichern und Beobachter (Kopfzeile, Navigation) informieren. */
export function aendern(fn: (f: Fortschritt) => void): void {
  fn(fortschritt);
  speichern(fortschritt);
  beobachter.forEach((b) => b());
}

export function ersetzen(neu: Fortschritt): void {
  fortschritt = neu;
  speichern(fortschritt);
  beobachter.forEach((b) => b());
}

export function beobachten(fn: () => void): void {
  beobachter.add(fn);
}

export const lernpfadIds = lernpfad.map((e) => e.lektion.id);

export function aktuelleStatus(): Map<string, LektionsStatus> {
  const f = fortschritt;
  const liste = statusListe(lernpfadIds, new Set(Object.keys(f.lektionen)), f.einstellungen.erkunden);
  return new Map(lernpfadIds.map((id, i) => [id, liste[i]]));
}

export function themaAnwenden(): void {
  const t = fortschritt.einstellungen.thema;
  const root = document.documentElement;
  if (t === 'system') root.removeAttribute('data-theme');
  else root.setAttribute('data-theme', t === 'hell' ? 'light' : 'dark');
}
