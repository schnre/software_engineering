# 0005 – Lerndidaktik und Erweiterungen gegenüber der Vorgabe

- Status: Angenommen
- Datum: 2026-10-16

## Kontext

Die ursprüngliche Vorgabe beschreibt fünf Phasen (Toolchain, C++-Fundamente, CI/CD, Architektur, Architektur-Konzepte). Das Ziel ist aber, das Wissen für eine Rolle als **Senior C++-Entwickler** aufzubauen. Dafür fehlten Themen, an denen sich im Alltag zeigt, ob jemand Senior ist. Ausserdem sollte die App nicht nur Wissen präsentieren, sondern nach gut belegten Lernprinzipien funktionieren.

## Entscheidung

### Curriculum: acht statt fünf Phasen

| Phase | Neu oder erweitert |
|---|---|
| 1 Unter der Haube | zusätzlich: Linkage, Name Mangling, `extern "C"`, Laufzeit-Loader (`rpath`, `ldd`) |
| 2 C++-Fundamente | zusätzlich: Wertkategorien und Move-Semantik, Undefined Behavior |
| 3 Testen, Debuggen, Analysieren | **neu**: GoogleTest/GoogleMock, gdb, Core Dumps, Sanitizer, clang-tidy |
| 4 Nebenläufigkeit und Performance | **neu**: Threads, Data Races, Atomics, Speichermodell, Caches, Profiling |
| 5 CI/CD | zusätzlich: Git im Team (Branching, Rebase) |
| 6 Architektur in grossen Projekten | zusätzlich: API-/ABI-Stabilität, Paketmanager |
| 7 Architektur-Konzepte in C++ | wie Vorgabe (ehemals Phase 5) |
| 8 Senior-Kompetenzen | **neu**: technische Schulden, Trade-offs, Schätzen, Mentoring |

### Lernmechaniken

- **Abrufen statt Lesen** (retrieval practice): Mindestens die Hälfte der Schritte sind Übungen. Der Validator erzwingt das.
- **Erst denken, dann erklären:** Viele Lektionen beginnen mit einer Frage, bevor das Konzept erklärt wird.
- **Sofortige Korrektur in der Sitzung:** Falsch beantwortete Übungen kommen am Ende der Lektion einmal wieder.
- **Verteiltes Wiederholen:** Leitner-System mit 5 Boxen und Abständen von 1, 2, 4, 8 und 16 Tagen.
- **Interleaving:** Das *Mischtraining* mischt Übungen aus verschiedenen Modulen.
- **Begründung pro Option** (`begruendungen`): Erklärt, warum die richtige Antwort richtig ist und warum jede falsche falsch ist.
- **Labor:** Optionale Aufgabe am eigenen Rechner mit Befehlen und erwarteter Beobachtung. Die App kann nicht kompilieren, aber Werkzeuge wie `nm`, `objdump` oder `gdb` lernt man nur durch Benutzen.
- **Glossar:** wird automatisch aus den `begriffe` aller Lektionen aufgebaut. Englische Originalbegriffe stehen in Klammern.
- **Weiterlesen:** Links auf Primärquellen (cppreference, GCC-, CMake-Dokumentation) statt Zitaten.
- **Erkundungsmodus:** Wer ein Thema kennt, kann alle Lektionen freischalten, statt sich durchzuklicken.
- **Streak:** zählt auch abgeschlossene Wiederholungen, nicht nur neue Lektionen, weil Wiederholen genauso wichtig ist.

## Konsequenzen

- Das Curriculum ist deutlich grösser. Module ohne fertige Lektionen erscheinen im Lernpfad als *In Vorbereitung* (`geplant` in `curriculum.json`), damit der Weg zum Senior von Anfang an sichtbar ist.
- Die Level-Schwellen (Junior 0, Mid 300, Senior 900, Principal 1800 XP) sind so gewählt, dass *Senior* etwa nach der Hälfte des vollständigen Curriculums inklusive Wiederholungen erreicht wird.
