# Deployment — Neue Static Web App mit den neuen Inhalten

Die Seite in diesem Ordner (entbrandt, Use Cases für Komposit / Leben / Kranken
+ übergreifend) soll auf die neue Static Web App `intellectual-twin-insurance-arag`
deployt werden.

## 1. Vorbereitung: Binär-Assets ergänzen

Die folgenden Dateien aus dem Quell-Zip in den `assets/`-Ordner kopieren
(Format: ZIP entpacken → `assets/` → Dateien hierher):

- `assets/jenga-impact-tower.jpg`  (Hero-Bild)
- `assets/qr-code.png`             (QR-Code im Kontaktbereich)
- `assets/florian-liepe.jpg`       (Porträt)
- `assets/oliver-huefner.png`      (Porträt)
- `assets/og.png`                  (Social-Share-Bild)

**Nicht** kopieren: `signal-iduna-logo.png`, `signal-iduna-mark.png`
(werden nicht mehr referenziert).

Hinweis: Bei einem **Fork** des Original-Repos sind die Binär-Assets bereits
enthalten — dann nur `og.png` ersetzen (altes Branding) und die beiden
SI-Logos aus `assets/` löschen.

⚠️ Vor dem Live-Gang prüfen: `og.png` stammt noch aus der alten Version und
enthält vermutlich noch das alte Branding — am besten neu generieren.

## 2. Weg A (empfohlen): GitHub-Repo + automatisches Deployment

1. Auf GitHub ein neues, leeres Repo anlegen, z. B.
   `intellectual-twin-insurance-arag` (privat oder intern).
2. Diesen Projektordner als Git-Repo initialisieren und pushen:

   ```bash
   cd "C:\Users\e963456\I-Twin\Allgemeine I-TWIN Seite"
   git init
   git add .
   git commit -m "Initial: Intellectual Twin landing page (Komposit/Leben/Kranken + uebergreifend)"
   git branch -M main
   git remote add origin https://github.com/<org>/intellectual-twin-insurance-arag.git
   git push -u origin main
   ```

3. Die Static Web App mit dem Repo verbinden:
   - **App bereits mit diesem Repo angelegt** (Source: GitHub): nichts weiter tun —
     der Workflow deployt jeden Push auf `main` automatisch.
   - **App mit anderem Repo verbunden**: im Portal die Deployment-Quelle ändern
     oder — bei einer frischen, leeren App am einfachsten — die App löschen und
     neu anlegen: Create a resource → Static Web App → Source *GitHub* → dieses
     Repo + Branch `main` → Build: Preset *Custom*, App location `/`, API- und
     Output location leer.
4. Nach dem Push ist die Seite unter `https://<app-name>.azurestaticapps.net`
   erreichbar. `staticwebapp.config.json` und `.nojekyll` werden mitdeployt.

## 2b. Weg mit einem Fork

Wurde die App mit einem Fork des Original-Repos angelegt, liegen im Fork noch
die geerbten Original-Dateien. So kommen die neuen Inhalte hinein:

1. Fork klonen:
   ```bash
   git clone https://github.com/<account>/<fork>.git
   cd <fork>
   ```
2. Die neu entwickelten Dateien aus diesem Projektordner in den Fork kopieren
   (Explorer) und damit die geerbten überschreiben:
   `index.html`, `styles.css`, `README.md`, `tests/validate.cjs`
   (optional `DEPLOYMENT.md`). Identisch geblieben — keine Aktion nötig:
   `script.js`, `staticwebapp.config.json`, `.nojekyll`,
   `assets/meids-logo.svg`, `assets/eraneos-logo.svg`.
3. Im Fork vorhandene Binär-Assets: `assets/og.png` **ersetzen** (enthält das
   alte Branding) und `assets/signal-iduna-logo.png` +
   `assets/signal-iduna-mark.png` **löschen** (ungenutzt).
4. Geerbte Workflows aufräumen (`.github/workflows/`): Die geerbte
   `azure-static-web-apps-<hash>.yml` aus dem Original-Repo deployt auf die
   ORIGINAL-App und schlägt im Fork fehl (fehlendes App-Secret) — **löschen**.
   Die Workflow-Datei der neuen App (von Azure beim Verbinden committet) bleibt.
   `pages.yml` ebenfalls entfernen, falls keine Fork-Pages-Seite gewünscht.

**Azure App erstellen (falls noch nicht geschehen):** Portal → *Create a
resource* → *Static Web App* → Name `intellectual-twin-insurance-arag`,
Plan *Free*, Region *West Europe*, Source *GitHub* → Fork-Repository +
Branch `main`; Build: Preset *Custom*, App location `/`, API- und Output
location leer. Azure committet beim Erstellen die Workflow-Datei in den Fork
und startet den ersten Deploy (1–2 Min.) — Reihenfolge (vor oder nach dem
Push) funktioniert beides; nach dem Push bringt der erste Deploy direkt die
neuen Inhalte.
5. GitHub → Tab **Actions**: Falls gefragt wird, Workflows zu aktivieren
   (Standard bei Forks), aktivieren — sonst deployt nichts.
6. Push:
   ```bash
   git add .
   git commit -m "Rebrand: use cases Komposit/Leben/Kranken + cross-line, Logos entfernt"
   git push origin main
   ```
7. Deploy prüfen: GitHub → Actions (grün) → App-URL öffnen — Use-Cases-Sektion
   zeigt **01 · Komposit, 02 · Leben, 03 · Kranken, 04 · Übergreifend**,
   Lockup liest „Me.IDs · For · Insurance".

## 3. Weg B (schnell, ohne Git): Direkter Upload

Für einen schnellen Test ohne Repo — per SWA CLI mit Deployment-Token:

```bash
npm install -g @azure/static-web-apps-cli
# Token: Azure Portal → App → Overview → "Manage deployment token"
swa deploy "C:\Users\e963456\I-Twin\Allgemeine I-TWIN Seite" ^
  --deployment-token <token> --env production
```

Hinweis: Bei einer GitHub-verbundenen App überschreibt der nächste Git-Push
diesen Upload. Für den Dauerbetrieb Weg A verwenden.

## 4. Custom Domain (optional)

Portal → App → **Custom domains** → Add: z. B. `intellectual-twin-insurance-arag.eraneos.com`
eintragen und im DNS einen CNAME auf `<app-name>.azurestaticapps.net` setzen.
Validierung abwarten — TLS-Zertifikat wird automatisch ausgestellt.

## 5. Checkliste vor dem Live-Gang

- [ ] Alle 5 Binär-Assets liegen in `assets/` (Seite ohne sie zeigt fehlende Bilder)
- [ ] `og.png` ohne altes Branding
- [ ] `node tests/validate.cjs` läuft ohne Fehler
- [ ] EN/DE-Umschalter geprüft, Formular-Testabfrage gesendet
- [ ] Default-URL bzw. Custom Domain geöffnet und alle Sektionen angesehen
