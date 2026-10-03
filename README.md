# Sprachgarten · 德语小花园

Deutsch lernen auf A2-Niveau mit chinesischen Hilfen: Wortschatz, Lesen und Hören.
Die Seite läuft komplett im Browser, ohne Server und ohne Anmeldung.

## Dateien

| Datei | Inhalt |
|---|---|
| `index.html` | Startdatei der Seite |
| `style.css` | Design (Farben, Schriften, Layout, hell/dunkel) |
| `data.js` | **Alle Lerninhalte**: Wörter, Lesetexte, Hördialoge, Diktatsätze |
| `app.js` | Programmlogik (Übungen, Sprachausgabe, Fortschritt) |
| `manifest.webmanifest`, `*.png` | App-Icon für den Home-Bildschirm |

## Veröffentlichen mit GitHub Pages

1. Neues **öffentliches** Repository anlegen, z. B. `sprachgarten`.
2. Auf „uploading an existing file“ klicken, **alle Dateien** aus diesem Ordner hineinziehen
   (nicht den Ordner selbst, nicht die ZIP-Datei) und „Commit changes“ klicken.
3. **Settings → Pages**: Unter „Build and deployment“ bei *Source* „Deploy from a branch“ wählen,
   Branch `main` und Ordner `/ (root)`, dann **Save**.
4. Nach ein bis zwei Minuten ist die Seite erreichbar unter
   `https://BENUTZERNAME.github.io/sprachgarten/`

## Inhalte ändern oder ergänzen

Alle Inhalte stehen in `data.js`. Ein Wort ist eine Zeile in diesem Format:

```
"Artikel|Wort|Plural oder Verbformen|Chinesisch|Beispielsatz|Chinesischer Beispielsatz",
```

- Bei Nomen ist der erste Teil `der`, `die` oder `das`.
- Bei Verben `v`, bei Adjektiven und Adverbien `a`.
- Ohne Plural: `–` eintragen.

Beispiele:

```
"die|Katze|Katzen|猫|Die Katze schläft auf dem Sofa.|猫在沙发上睡觉。",
"v|kochen|kocht, hat gekocht|做饭|Heute koche ich Nudeln.|今天我煮面条。",
"a|schnell||快的|Der Zug ist sehr schnell.|火车很快。",
```

Wichtig: Jede Zeile steht in geraden Anführungszeichen `"…"` und endet mit einem Komma.
Im Text selbst kein `|` und kein gerades `"` verwenden (für Zitate „…“ nehmen).

Nach dem Hochladen der geänderten Datei dauert es ein bis zwei Minuten, bis die Seite aktualisiert ist.

## Gut zu wissen

- **Fortschritt** wird im Browser des jeweiligen Geräts gespeichert (localStorage).
  Handy und Laptop haben also getrennte Fortschritte. Browserdaten löschen setzt ihn zurück.
- **Sprachausgabe** nutzt die Stimmen des Geräts. Klingt sie nicht deutsch:
  iPhone → Einstellungen › Bedienungshilfen › Gesprochene Inhalte › Stimmen › Deutsch.
- **Als App aufs Handy**: Seite im Browser öffnen → Teilen bzw. Menü → „Zum Home-Bildschirm“.
