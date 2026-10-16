# 0007 – Eigener Syntax-Highlighter

- Status: Angenommen
- Datum: 2026-10-16

## Kontext

Code-Blöcke brauchen Syntax-Hervorhebung für C++, Shell, CMake, Make, YAML, Groovy (Jenkinsfile), Bazel/Starlark, Linker-Skripte und Assembler. Übungen wie *Fehler finden* und *Lückentext* brauchen ausserdem Zugriff auf einzelne Zeilen und auf Fragmente zwischen Lücken.

## Entscheidung

Ein kleiner zeilenbasierter Tokenizer in `src/ui/highlight.ts` erkennt Kommentare (auch mehrzeilige Blockkommentare), Strings, Zahlen, Schlüsselwörter, Typen, Präprozessor-Direktiven und Variablen. Die Farben kommen aus CSS-Tokens und funktionieren im hellen und dunklen Modus.

## Konsequenzen

- **Einfacher:** keine Abhängigkeit, wenige Kilobyte, volle Kontrolle über die Zeilenstruktur.
- **Schwieriger:** Die Hervorhebung ist nicht perfekt (z. B. keine Raw-Strings). Für kurze Lernbeispiele genügt das.
- **Verworfen:** Prism oder Shiki. Beide arbeiten auf ganzen Blöcken und sind deutlich grösser (Shiki mehrere hundert KB).
