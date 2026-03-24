# mpool Digital Business Cards

Digitale Visitenkarten-App für mpool consulting. Built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **Digitale Visitenkarten** (`/card/[slug]`) — Mobilfreundliche Karte mit Kontaktinfo, vCard-Download und Kontaktformular
- **Kontakt-Austausch** — Besucher senden ihre Daten; beide Parteien erhalten eine E-Mail via Resend
- **QR-Codes** (`/qr/[slug]`) — Druckbare QR-Code-Seite pro Mitarbeiter
- **Admin-Panel** (`/admin`) — Passwortgeschütztes CRUD für Mitarbeiterverwaltung
- **Analytics** — Besucherstatistiken, CSV-Export, tägliche Trends
- **5 Kartendesigns** — Classic, Minimal, Dark, Elegant, Custom (eigene Farben/Layout)

## Setup (Entwicklung)

```bash
npm install
cp .env.local.example .env.local
# .env.local mit echten Werten befüllen (siehe unten)
npm run dev
```

## Umgebungsvariablen

| Variable | Beschreibung | Beispiel |
|---|---|---|
| `RESEND_API_KEY` | API-Key von [resend.com](https://resend.com) | `re_abc123...` |
| `NEXT_PUBLIC_BASE_URL` | Öffentliche URL der App (für QR-Codes) | `https://cards.mpool.de` |
| `ADMIN_PASSWORD` | Admin-Passwort (mind. 12 Zeichen, Groß/Klein/Zahlen) | `MeinSicheresPasswort2024!` |
| `SESSION_SECRET` | 64+ Hex-Zeichen für Session-Signierung | `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `STORAGE_DIR` | Persistenter Ordner für Laufzeitdaten und Uploads | `/var/lib/mpool-cards` |

> **Hinweis:** Nach dem ersten Login wird `ADMIN_PASSWORD` automatisch als salted Hash in `storage/data/auth.json` gespeichert. Die Env-Variable wird danach nicht mehr benötigt, kann aber als Fallback bleiben.

## Routen

| Route | Beschreibung | Zugriff |
|---|---|---|
| `/` | Homepage mit allen Mitarbeiterkarten | Öffentlich |
| `/card/[slug]` | Digitale Visitenkarte | Öffentlich |
| `/qr/[slug]` | Druckbare QR-Code-Seite | Öffentlich |
| `/admin` | Admin-Panel | Passwortgeschützt |
| `/api/health` | Health-Check (Monitoring) | Öffentlich |
| `/api/vcard/[slug]` | vCard-Download (.vcf) | Öffentlich |
| `/api/qr/[slug]` | QR-Code als PNG | Öffentlich |
| `/media/[filename]` | Laufzeit-Fotos aus persistentem Storage | Öffentlich |

## Sicherheit

- **Auth:** Scrypt-gehashte Passwörter mit zufälligem Salt (64 Byte)
- **Sessions:** HMAC-SHA256-signierte Cookies (HttpOnly, SameSite=strict, Secure in Prod), 12h TTL
- **Rate Limiting:** Login (10/15min), Kontaktformular (12/h pro Mitarbeiter)
- **Input-Validierung:** Alle Eingaben sanitisiert (XSS, Injection), Regex-Validierung
- **Upload-Schutz:** Typ-Whitelist (JPG/PNG/WebP), 5MB Limit, Re-Encoding via Sharp (strippt Metadaten)
- **Headers:** X-Frame-Options, X-Content-Type-Options, HSTS, Referrer-Policy, Permissions-Policy
- **Spam-Schutz:** Honeypot-Feld im Kontaktformular

## Datenspeicherung

Die App nutzt JSON-Dateien im Dateisystem, aber **nicht mehr im Quellbaum als Runtime-Speicher**. Zur Laufzeit werden Daten standardmaessig in `storage/` geschrieben oder in den per `STORAGE_DIR` gesetzten Ordner.

| Datei | Inhalt | Geschützt via .gitignore |
|---|---|---|
| `src/data/employees.json` | Seed-Daten für den ersten Start | Nein (Teil des Repos) |
| `storage/data/employees.json` | Laufende Mitarbeiterdaten | Ja |
| `storage/data/auth.json` | Passwort-Hash + Salt | Ja |
| `storage/data/events.json` | Kontakt-Events/Analytics | Ja |
| `storage/photos/` | Neue Mitarbeiterfotos (WebP) | Ja |

Alle Schreibvorgänge sind **atomar** (Write → Rename), um Datenkorruption bei Crashes zu verhindern.

> **Für dieses Projekt (8 Mitarbeiter, 1 Admin) ist JSON-basierte Speicherung auf einem VPS absolut ausreichend und produktionsstabil.** Für Serverless-Plattformen (Vercel, Netlify) müsste weiter auf eine externe Datenbank/Storage umgestellt werden.

## Deployment auf VPS (empfohlen)

### Voraussetzungen

- VPS mit Ubuntu/Debian (z.B. Hetzner, DigitalOcean)
- Node.js 18+ und npm
- Domain mit DNS A-Record auf die VPS-IP
- Nginx als Reverse-Proxy
- Certbot/Let's Encrypt für HTTPS

### 1. App auf den Server bringen

```bash
# Auf dem Server
git clone <repo-url> /opt/mpool-cards
cd /opt/mpool-cards
npm install --production
cp .env.local.example .env.local
# .env.local mit echten Werten befüllen
```

### 2. Erstellen der Datenverzeichnisse

```bash
mkdir -p /var/lib/mpool-cards/data /var/lib/mpool-cards/photos
# STORAGE_DIR=/var/lib/mpool-cards in .env.local setzen
```

### 3. Build & Start

```bash
npm run build
npm run start  # Startet auf Port 3000
```

### 4. PM2 für dauerhaften Betrieb

```bash
npm install -g pm2
pm2 start npm --name mpool-cards -- start
pm2 save
pm2 startup  # Autostart nach Reboot
```

### 5. Nginx Reverse-Proxy

```nginx
server {
    listen 80;
    server_name cards.mpool.de;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 10M;
    }
}
```

### 6. HTTPS mit Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d cards.mpool.de
```

### 7. .env.local für Produktion

```bash
RESEND_API_KEY=re_your_real_key
NEXT_PUBLIC_BASE_URL=https://cards.mpool.de
ADMIN_PASSWORD=EinSehrSicheresPasswort123!
SESSION_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
STORAGE_DIR=/var/lib/mpool-cards
```

### Deployment-Checkliste

- [ ] `.env.local` mit echten Werten auf dem Server
- [ ] `NEXT_PUBLIC_BASE_URL` zeigt auf die echte Domain (HTTPS)
- [ ] `ADMIN_PASSWORD` ist stark (mind. 12 Zeichen, gemischt)
- [ ] `SESSION_SECRET` ist ein zufälliger 64-Hex-String
- [ ] `STORAGE_DIR` zeigt auf einen persistenten Ordner
- [ ] `npm run build` läuft erfolgreich durch
- [ ] Nginx + HTTPS konfiguriert
- [ ] PM2 läuft und ist auf Autostart gesetzt
- [ ] Resend-Domain verifiziert (für E-Mail-Versand)
- [ ] Health-Check erreichbar: `curl https://cards.mpool.de/api/health`
- [ ] Admin-Login funktioniert unter `/admin`

## Resend Setup

1. Registriere dich bei [resend.com](https://resend.com)
2. Verifiziere deine Domain (`mpool.de`) oder nutze die Sandbox-Domain zum Testen
3. Erstelle einen API-Key und trage ihn in `.env.local` ein
