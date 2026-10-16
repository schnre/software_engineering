// Einstiegspunkt: App-Gerüst, Hash-Router, Kopfzeile und Navigation.
import './styles.css';
import { heute } from './progress/datum';
import { faelligeKarten } from './progress/leitner';
import { streakHeute } from './progress/streak';
import { levelFuer } from './progress/xp';
import { beobachten, themaAnwenden, zustand } from './ui/app';
import { h, leeren } from './ui/dom';
import { glossarAnsicht } from './ui/glossar';
import { lektionAnsicht } from './ui/lektion';
import { pfadAnsicht } from './ui/pfad';
import { profilAnsicht } from './ui/profil';
import { wiederholenAnsicht } from './ui/wiederholen';

const app = document.getElementById('app')!;

const streakAnzeige = h('span', { class: 'kopf-wert', title: 'Tages-Streak' });
const xpAnzeige = h('span', { class: 'kopf-wert', title: 'Erfahrungspunkte' });
const levelAnzeige = h('span', { class: 'kopf-level' });
const kopf = h('header', { class: 'app-kopf' },
  h('a', { class: 'marke', href: '#/', 'aria-label': 'Engineering Academy – zum Lernpfad' },
    h('span', { class: 'marke-logo', 'aria-hidden': 'true' }, '{ }'), h('span', { class: 'marke-text' }, 'Engineering Academy')),
  h('div', { class: 'kopf-status' }, levelAnzeige, streakAnzeige, xpAnzeige),
);

const NAV = [
  { href: '#/', name: 'Lernpfad', icon: '🧭', route: '' },
  { href: '#/wiederholen', name: 'Wiederholen', icon: '🔁', route: 'wiederholen' },
  { href: '#/glossar', name: 'Glossar', icon: '📖', route: 'glossar' },
  { href: '#/profil', name: 'Profil', icon: '👤', route: 'profil' },
];
const badge = h('span', { class: 'nav-badge', hidden: true });
const navLinks = NAV.map((n) =>
  h('a', { class: 'nav-link', href: n.href, 'data-route': n.route },
    h('span', { class: 'nav-icon', 'aria-hidden': 'true' }, n.icon), h('span', {}, n.name),
    n.route === 'wiederholen' ? badge : null));
const nav = h('nav', { class: 'app-nav', 'aria-label': 'Hauptnavigation' }, navLinks);
const inhalt = h('main', { id: 'inhalt', class: 'app-inhalt', tabindex: -1 });
const skip = h('a', { class: 'skip-link', href: '#inhalt', onClick: (e: Event) => { e.preventDefault(); inhalt.focus(); } }, 'Zum Inhalt springen');

leeren(app);
app.append(skip, kopf, inhalt, nav);

function kopfAktualisieren() {
  const f = zustand();
  const tag = heute();
  const streak = streakHeute(f.streak, tag);
  streakAnzeige.textContent = `🔥 ${streak}`;
  streakAnzeige.setAttribute('aria-label', `Streak: ${streak} ${streak === 1 ? 'Tag' : 'Tage'}`);
  streakAnzeige.classList.toggle('inaktiv', f.streak.letzterTag !== tag);
  xpAnzeige.textContent = `⚡ ${f.xp}`;
  xpAnzeige.setAttribute('aria-label', `${f.xp} XP`);
  levelAnzeige.textContent = levelFuer(f.xp).level.name;
  const faellig = faelligeKarten(f, tag).length;
  badge.hidden = faellig === 0;
  badge.textContent = String(faellig);
  badge.setAttribute('aria-label', `${faellig} fällig`);
}

function route() {
  const pfad = location.hash.replace(/^#\/?/, '').split('?')[0];
  const [teil, param] = pfad.split('/');
  const inSitzung = teil === 'lektion';
  document.body.classList.toggle('modus-lektion', inSitzung);
  for (const l of navLinks) {
    if (l.dataset.route === teil) l.setAttribute('aria-current', 'page');
    else l.removeAttribute('aria-current');
  }
  leeren(inhalt);
  window.scrollTo({ top: 0 });
  switch (teil) {
    case 'lektion':
      lektionAnsicht(decodeURIComponent(param ?? ''), inhalt);
      document.title = 'Lektion · Engineering Academy';
      break;
    case 'wiederholen':
      wiederholenAnsicht(inhalt);
      document.title = 'Wiederholen · Engineering Academy';
      break;
    case 'glossar':
      inhalt.append(glossarAnsicht());
      document.title = 'Glossar · Engineering Academy';
      break;
    case 'profil':
      inhalt.append(profilAnsicht());
      document.title = 'Profil · Engineering Academy';
      break;
    default:
      inhalt.append(pfadAnsicht());
      document.title = 'Engineering Academy';
  }
  if (teil !== 'lektion' && document.activeElement && document.activeElement !== document.body) inhalt.focus({ preventScroll: true });
}

themaAnwenden();
beobachten(kopfAktualisieren);
kopfAktualisieren();
window.addEventListener('hashchange', route);
route();

// Ein Tageswechsel (App bleibt offen) soll Streak und fällige Karten aktualisieren.
document.addEventListener('visibilitychange', () => { if (!document.hidden) kopfAktualisieren(); });

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => { /* offline-Funktion optional */ });
  });
}
