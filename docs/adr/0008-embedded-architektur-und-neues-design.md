# 0008 – Embedded, Systemarchitektur, Sicherheit und neues Design

- Status: Angenommen
- Datum: 2026-10-17
- Ergänzt: [0005](0005-lerndidaktik.md)

## Kontext

Die App ist für Senior-C++-Entwickler im **Embedded-Bereich** gedacht. Das Curriculum aus ADR 0005 deckte die allgemeinen Grundlagen ab, es fehlten aber:

- Hardwarenahe Themen: Register, Interrupts, Schnittstellen, DMA, Startcode, Bootloader
- Echtzeit und RTOS, Speicher ohne Heap, C++ auf Mikrocontrollern, Embedded Linux, Debugging auf der Zielhardware
- Fortgeschrittenes modernes C++ (C++17 bis C++26)
- Architektur auf Systemebene: Architekturstile, Ereignisse, Active Objects, IPC, AUTOSAR, ROS 2, Dokumentation und Bewertung
- Funktionale Sicherheit und Security, die in Embedded-Projekten zunehmend Pflicht sind (ISO 26262, IEC 61508, Cyber Resilience Act)

Ausserdem wirkte das bisherige Design zu nüchtern und starr. Für eine App, die man täglich öffnen soll, ist Motivation ein wichtiger Teil der Didaktik.

## Entscheidung

### Curriculum mit 13 Phasen

Neue Phasen wurden thematisch eingeordnet, nicht hinten angehängt. Bestehende Phasen wurden dafür umnummeriert (Ids, Dateinamen, Ordner und Querverweise „Modul X.Y“):

| Neu | Inhalt | Vorher |
|---|---|---|
| 1, 2 | Unter der Haube, C++-Fundamente | 1, 2 |
| **3** | **Fortgeschrittenes C++** | neu |
| 4, 5 | Testen, Nebenläufigkeit | 3, 4 |
| **6** | **Embedded: Hardware verstehen** | neu |
| **7** | **Embedded-Software und RTOS** | neu |
| 8, 9, 10 | CI/CD, Architektur in grossen Projekten, Architektur-Konzepte | 5, 6, 7 |
| **11** | **Architekturstile und Systemarchitektur** | neu |
| **12** | **Funktionale Sicherheit und Security** | neu |
| 13 | Senior-Kompetenzen | 8 |

Schema und Validator erlauben dafür zweistellige Phasen- und Modulnummern.

### Motivation

- **Tagesziel** (10, 20, 35 oder 50 XP) mit Fortschrittsring auf der Startseite.
- **Abzeichen** werden aus dem Fortschritt *berechnet* und nicht gespeichert. Damit bleiben sie nach Import und auf jedem Gerät konsistent, und neue Abzeichen gelten rückwirkend.
- **Level-Schwellen** wurden mit dem grösseren Curriculum mitskaliert (Mid 450, Senior 1350, Principal 2700 XP), damit *Senior* weiterhin etwa nach der Hälfte erreicht wird.
- Aktivitätskalender (16 Wochen), Serienzähler in der Sitzung, Konfetti bei sehr guten Ergebnissen, neuen Abzeichen oder Level-Aufstieg.

### Design

- Design-Tokens als CSS-Variablen für hell und dunkel, jede Phase mit eigener Farbe (`farbe` als Farbton im Curriculum) und eigenem Symbol.
- Lernpfad als Zickzack aus runden Knoten mit 3D-Schatten, statt einer Liste.
- Schwebende Navigation unten auf dem Handy, Seitenleiste ab 960 px Breite.
- Sitzung mit Fortschrittsbalken und Rückmeldung als Bottom Sheet.
- Eigenes SVG-Icon-Set und selbst gehostete variable Schriften (Inter, JetBrains Mono) über `@fontsource-variable`. Kein CDN, damit die App offline und ohne Tracker funktioniert (ADR 0001).
- Weiterhin ohne UI-Framework (ADR 0003).

## Konsequenzen

- Das Curriculum wächst von 106 auf 168 Lektionen. Die Inhalte bleiben reine JSON-Daten, neue Lektionen brauchen weiterhin keinen Code.
- Das Speicherformat des Fortschritts steigt auf Version 2. Fortschritt im alten Format (Version 1, aus dem Browser oder aus einer Export-Datei) wird beim Laden automatisch auf die neuen Lektions-Ids umgeschrieben, damit niemand seinen Stand verliert.
- Erklärungen dürfen jetzt Codeblöcke mit drei Backticks enthalten. Sie werden mit dem eigenen Highlighter (ADR 0007) dargestellt.
- Die Themen zu Normen (ISO 26262, IEC 61508, MISRA) werden in eigenen Worten erklärt und auf die Originalquellen verlinkt, ohne Normtexte zu zitieren.
