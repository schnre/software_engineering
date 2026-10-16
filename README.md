# Engineering Academy

Software Engineering für C++-Entwickler in kurzen, spielerischen Lektionen, ähnlich wie Mimo oder Duolingo. Der Lernpfad führt von Compiler, Linker und Build-Systemen über C++-Fundamente, Testen, Nebenläufigkeit und CI/CD bis zu Architektur und den Kompetenzen, die einen Senior ausmachen.

**Live:** https://schnre.github.io/software_engineering/

- Lektionen von 3 bis 7 Minuten, mindestens die Hälfte jeder Lektion sind Übungen
- 8 Übungstypen, alle per Antippen, Maus oder Tastatur bedienbar
- XP, Tages-Streak, Level (Junior → Mid → Senior → Principal)
- Wiederholung nach dem Leitner-System (5 Boxen) und Mischtraining über Module hinweg
- Labor-Aufgaben für den eigenen Rechner, Glossar, Links auf Primärquellen
- Kein Backend, keine Konten, keine Tracker. Der Fortschritt bleibt im Browser und lässt sich als JSON exportieren
- Funktioniert offline, installierbar als App, heller und dunkler Modus

## Lernpfad

| Phase | Inhalt | Lektionen |
|---|---|---|
| 1 Unter der Haube | Präprozessor, Compiler, Linker, ODR, Linkage, Mangling, Bibliotheken, ELF, Linker-Skripte, Toolchains, Cross-Kompilierung, Make, CMake, Ninja, Bazel, reproduzierbare Builds | 18 |
| 2 C++-Fundamente | Speicherlayout, Lebenszeit, RAII, Smart Pointers, Wertkategorien, Move-Semantik, Rule of Zero, vtable, Slicing, Templates, `constexpr`, Undefined Behavior, Fehlerbehandlung, fremde Codebases lesen | 19 |
| 3 Testen, Debuggen, Analysieren | GoogleTest, Fixtures, GoogleMock, Testpyramide, TDD, gdb, Core Dumps, `git bisect`, Sanitizer, Valgrind, Warnungen, clang-tidy, clang-format | 12 |
| 4 Nebenläufigkeit und Performance | Threads, Data Races, Mutexe, Deadlocks, Condition Variables, Futures, Atomics, Speichermodell, Caches, Profiling, Allokationen | 10 |
| 5 CI/CD | CI, Continuous Delivery, Pipeline-Stufen, Quality Gates, Jenkins, Jenkinsfile, Shared Libraries, GitHub Actions, die Pipeline dieser App, Branching, Rebase | 13 |
| 6 Architektur in grossen Projekten | Kohäsion und Kopplung, Module schneiden, Header als Verträge, API/ABI, Include-Hygiene, Dependency Injection, Zyklen, Paketmanager, Code-Reviews | 10 |
| 7 Architektur-Konzepte in C++ | SOLID, Law of Demeter, Komposition, Schichten, HAL, Ports & Adapters, State Machine, Observer, Strategy, Adapter, Facade, Singleton, Templates vs. `virtual`, CRTP, PIMPL, starke Typen, MISRA, ADRs | 17 |
| 8 Senior-Kompetenzen | Technische Schulden, Legacy-Code, Trade-offs, umkehrbare Entscheidungen, Schätzen, Risiken, Kommunikation, Mentoring | 8 |

Zusammen 106 Lektionen. Neue Lektionen lassen sich jederzeit ergänzen, siehe unten.

Warum es acht statt der ursprünglich fünf Phasen sind und welche Lernprinzipien die App umsetzt, steht in [ADR 0005](docs/adr/0005-lerndidaktik.md).

## Lokal starten

Voraussetzung: Node.js 20 oder neuer.

```bash
npm install
npm run dev        # Entwicklungsserver mit Live-Reload
npm run validate   # alle Lektionen prüfen
npm test           # Logik-Tests und Lösbarkeit aller Übungen
npm run build      # validieren, Typen prüfen, nach dist/ bauen
npm run preview    # gebaute Version ansehen
```

## Projektstruktur

```
├─ index.html
├─ src/
│  ├─ engine/      Curriculum laden, Sitzungsablauf, Freischaltung
│  ├─ exercises/   ein Modul pro Übungstyp
│  ├─ progress/    XP, Streak, Leitner-Boxen, localStorage, Export/Import
│  └─ ui/          Lernpfad, Lektion, Ergebnis, Wiederholen, Glossar, Profil
├─ content/
│  ├─ curriculum.json   Reihenfolge von Phasen, Modulen und Lektionen
│  └─ phase-1 … phase-8 eine JSON-Datei pro Lektion
├─ schema/lesson.schema.json
├─ scripts/validate-content.mjs
├─ tests/
├─ docs/adr/       Architecture Decision Records
└─ .github/workflows/  validate.yml, deploy.yml
```

## Eine neue Lektion hinzufügen

Eine neue Lektion braucht **keine Code-Änderung**, nur eine JSON-Datei und einen Eintrag im Curriculum.

1. **Datei anlegen:** `content/phase-<N>/p<N>-m<M>-l<L>.json`. Der Dateiname muss der `id` entsprechen.
2. **Im Curriculum eintragen:** In `content/curriculum.json` die id beim passenden Modul unter `lektionen` ergänzen. Steht das Thema unter `geplant`, dort entfernen.
3. **Prüfen:** `npm run validate && npm test`
4. **Ansehen:** `npm run dev`. Unter *Profil → Erkundungsmodus* kannst du jede Lektion direkt öffnen.
5. **Pull Request:** Die CI validiert die Lektion. Ist etwas ungültig, schlägt die Pipeline fehl, und es wird nichts veröffentlicht.

### Minimales Beispiel

```json
{
  "$schema": "../../schema/lesson.schema.json",
  "id": "p2-m1-l1",
  "phase": 2,
  "modul": "2.1 Speicherlayout zur Laufzeit",
  "titel": "Stack und Heap",
  "lernziele": ["Erklären, wann ein Objekt auf dem Stack und wann auf dem Heap liegt"],
  "dauerMinuten": 5,
  "schritte": [
    {
      "typ": "multiple-choice",
      "frage": "Wo liegt `int x = 5;` innerhalb einer Funktion?",
      "optionen": ["Auf dem Stack", "Auf dem Heap", "In `.data`"],
      "korrekt": 0,
      "erklaerung": "Lokale Variablen liegen im Stack Frame der Funktion …",
      "begruendungen": ["Richtig …", "Nur mit `new` …", "Nur globale Variablen …"]
    }
  ],
  "praxis": "Wo begegnet dir das im Alltag? …"
}
```

Mit `"$schema"` bekommst du in VS Code Autovervollständigung und Fehlermarkierungen beim Schreiben.

### Übungstypen

| `typ` | Pflichtfelder | Hinweise |
|---|---|---|
| `erklaerung` | `text` | optional `titel`, `code`, `terminal`, `tabelle`, `diagramm`. Höchstens etwa 120 Wörter |
| `multiple-choice` | `frage`, `optionen` (3–4), `korrekt`, `erklaerung` | `korrekt` ist ein Index oder ein Array (Mehrfachauswahl) |
| `code-lesen` | wie oben plus `code` | 2–5 Optionen, z. B. „kompiliert / Compilerfehler / Linkerfehler“ |
| `terminal-deuten` | wie oben plus `terminal` | `terminal.befehl` und `terminal.ausgabe` (Zeilen) |
| `lueckentext` | `frage`, `text` **oder** `code`, `luecken`, `erklaerung` | Lücken mit `{{?}}` markieren. Mit `auswahl` gibt es Bausteine zum Antippen, sonst Texteingabe |
| `reihenfolge` | `frage`, `elemente` (in **richtiger** Reihenfolge), `erklaerung` | Die App mischt selbst |
| `zuordnen` | `frage`, `paare` (`links`/`rechts`), `erklaerung` | 3–6 Paare. Die App mischt die rechte Spalte |
| `fehler-finden` | `frage`, `code`, `fehlerZeile` (1-basiert), `erklaerung` | |

Für alle Auswahl-Übungen gilt:

- `begruendungen` hat genau einen Eintrag pro Option und erklärt, warum sie richtig oder falsch ist. Bitte immer angeben.
- Die App mischt die Optionen. Mit `"fest": true` bleibt die Reihenfolge erhalten, z. B. bei „Ja/Nein“ oder Zahlenwerten.

Optionale Felder pro Schritt: `hinweis` (Tipp-Knopf) und `id`. Vergib eine `id`, wenn du Schritte später umsortieren willst: Die Wiederholungs-Boxen merken sich Übungen über `id` oder, ohne `id`, über die Position.

Code steht als Array von Zeilen: `"code": { "sprache": "cpp", "datei": "main.cpp", "zeilen": ["int main() {", "}"], "anmerkungen": [{ "zeile": 1, "text": "…" }] }`. Sprachen: `cpp`, `c`, `bash`, `cmake`, `make`, `yaml`, `groovy`, `json`, `asm`, `starlark`, `python`, `linker`, `text`.

Texte unterstützen `Code`, **fett**, *kursiv*, Aufzählungen mit `- ` und Absätze (Leerzeile).

### Weitere Felder einer Lektion

| Feld | Zweck |
|---|---|
| `praxis` | Pflicht. Karte „Wo begegnet dir das im Alltag?“ am Ende der Lektion |
| `labor` | Aufgabe für den eigenen Rechner: `anleitung`, `befehle`, `beobachtung` |
| `begriffe` | Fachbegriffe mit `englisch` und `erklaerung`. Erscheinen im Glossar |
| `weiterlesen` | Links auf Primärquellen (`titel`, `url`, nur `https`) |

### Was der Validator prüft

Zusätzlich zum Schema prüft `scripts/validate-content.mjs`:

- Dateiname = `id`, Ordner = Phase, Lektion steht im Curriculum und umgekehrt
- mindestens die Hälfte der Schritte sind Übungen
- `korrekt` und `fehlerZeile` zeigen auf existierende Optionen bzw. Zeilen, `begruendungen` passt zur Anzahl Optionen
- Anzahl `{{?}}` entspricht der Anzahl `luecken`, jede Lösung kommt in `auswahl` vor
- kein „ß“ (Schweizer Rechtschreibung)

`tests/inhalte.test.ts` löst zusätzlich jede Übung mit der hinterlegten Lösung.

### Inhaltliche Richtlinien

- Deutsch in Schweizer Rechtschreibung (`ss` statt `ß`). Fachbegriffe beim ersten Auftreten erklären, englischer Originalbegriff in Klammern.
- Wo es passt, mit einer Frage beginnen und erst danach erklären.
- Falsche Optionen müssen plausibel sein, keine offensichtlich absurden Antworten.
- Code-Beispiele kurz halten und mit `anmerkungen` Zeile für Zeile erklären.
- Normen und Bücher in eigenen Worten erklären, nicht zitieren. Bei unsicheren Aussagen gegen die Primärquelle prüfen und sie unter `weiterlesen` verlinken.
- Konkrete Ausgaben (Compiler, `nm`, `objdump`) wenn möglich mit echten Werkzeugen erzeugen, nicht erfinden.

## Deployment

Die App läuft auf GitHub Pages:

1. In den Repository-Einstellungen unter **Settings → Pages → Build and deployment** als Quelle **GitHub Actions** wählen.
2. Auf `main` pushen. `validate.yml` prüft Inhalte, Typen und Tests und baut die App. War das erfolgreich, veröffentlicht `deploy.yml` den geprüften Commit.

Ein Pull Request mit einer ungültigen Lektion lässt *Validate* fehlschlagen, und *Deploy* läuft nicht.

## Architektur-Entscheidungen

Siehe [docs/adr/](docs/adr/README.md).
