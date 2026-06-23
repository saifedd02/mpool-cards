# Wallet-Setup (Apple Wallet & Google Wallet)

Die Buttons „Zu Apple Wallet" / „Zu Google Wallet" erscheinen automatisch, sobald
die jeweiligen Umgebungsvariablen gesetzt sind. **Nur der Betreiber (mpool)
braucht diese Konten/Zertifikate – die Empfänger der Visitenkarte brauchen
nichts und tippen nur auf den Button.**

Auf Vercel: alle Werte unter **Project → Settings → Environment Variables**
hinterlegen, danach neu deployen. Lokal: in `.env.local` (siehe
`.env.local.example`).

---

## Apple Wallet (iPhone)

Voraussetzung: Apple Developer Program ($99/Jahr).

1. **Pass Type ID anlegen**
   developer.apple.com → Certificates, IDs & Profiles → Identifiers → „+" →
   **Pass Type IDs** → z.B. `pass.de.mpool-consulting.visitenkarte`.

2. **Zertifikat erstellen**
   Beim Pass Type ID auf „Create Certificate" → CSR aus der Schlüsselbund-App
   (Keychain) hochladen → Zertifikat herunterladen (`.cer`) → doppelklicken
   (landet im Schlüsselbund).

3. **Als .p12 exportieren**
   Im Schlüsselbund das Zertifikat **mitsamt privatem Schlüssel** auswählen
   (am besten inkl. der „Apple Worldwide Developer Relations"-Kette) →
   Rechtsklick → „2 Objekte exportieren…" → Format **.p12** → Passwort vergeben.

4. **Base64 erzeugen**
   ```bash
   base64 -i Zertifikate.p12 | pbcopy
   ```

5. **Env-Variablen setzen**
   ```
   APPLE_WALLET_TEAM_ID=DEINE10ZEICHEN          # Apple Developer → Membership
   APPLE_WALLET_PASS_TYPE_IDENTIFIER=pass.de.mpool-consulting.visitenkarte
   APPLE_WALLET_ORGANIZATION_NAME=mpool consulting
   APPLE_WALLET_CERTIFICATE_P12_BASE64=<Base64 aus Schritt 4>
   APPLE_WALLET_CERTIFICATE_PASSWORD=<dein .p12-Passwort>
   ```

   Falls die `.p12` die WWDR-Kette **nicht** enthält, zusätzlich:
   ```
   # https://www.apple.com/certificateauthority/AppleWWDRCAG4.cer
   # in PEM wandeln und base64-kodieren:
   #   openssl x509 -inform DER -in AppleWWDRCAG4.cer -out wwdr.pem
   #   base64 -i wwdr.pem | pbcopy
   APPLE_WALLET_WWDR_PEM_BASE64=<Base64 des WWDR-PEM>
   ```

Test: Karte am iPhone öffnen → „Zu Apple Wallet" → Karte wird hinzugefügt.

---

## Google Wallet (Android)

Voraussetzung: kostenloses Google-Wallet-Issuer-Konto.

1. **Issuer-Konto** unter https://pay.google.com/business/console anlegen →
   **Issuer ID** notieren.

2. **Service-Account** in der Google Cloud Console anlegen → JSON-Schlüssel
   herunterladen. In der Wallet-Console unter „Users" dem Service-Account
   Zugriff geben.

3. **Google Wallet API** im Cloud-Projekt aktivieren.

4. **Base64 des JSON erzeugen**
   ```bash
   base64 -i service-account.json | pbcopy
   ```

5. **Env-Variablen setzen**
   ```
   GOOGLE_WALLET_ISSUER_ID=3388000000022xxxxxx
   GOOGLE_WALLET_SERVICE_ACCOUNT_JSON_BASE64=<Base64 aus Schritt 4>
   GOOGLE_WALLET_CLASS_SUFFIX=business-card      # optional
   ```

Hinweis: Das Pass-Logo lädt Google von `<deine-domain>/wallet-logo.png` –
diese URL muss öffentlich erreichbar sein (auf der Produktions-Domain ist sie es).

Test: Karte auf einem Android-Gerät öffnen → „Zu Google Wallet" → Save-Flow.
