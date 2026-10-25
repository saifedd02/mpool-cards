# Digitale Visitenkarten für mpool

Webanwendung für Mitarbeiterkarten mit Kontaktdaten, QR-Code und vCard-Download. Über die Verwaltung lassen sich Karten bearbeiten und gestalten. Besucher können über ein Kontaktformular ihre Daten austauschen. Optional lassen sich Karten zu Apple Wallet oder Google Wallet hinzufügen.

Das Projekt gehört zu meiner Werkstudententätigkeit bei mpool consulting.

## Aufbau

- Next.js 14 und TypeScript für Seiten, API und Verwaltung.
- Tailwind CSS für die Gestaltung der Karten.
- Vercel Blob für JSON-Daten und hochgeladene Fotos.
- Resend für den Kontaktversand.
- `passkit-generator` und signierte JWTs für die Wallet-Anbindung.

Die aktuelle Fassung verwendet Vercel Blob. Ein lokaler Ordner über `STORAGE_DIR` ist kein unterstütztes Speicherbackend dieser Fassung.

## Entwicklungsumgebung

```bash
npm ci
cp .env.local.example .env.local
npm run dev
```

Die Oberfläche läuft unter `http://localhost:3000`. Die folgenden Werte werden serverseitig benötigt:

| Variable | Verwendung |
| --- | --- |
| `BLOB_READ_WRITE_TOKEN` | Zugriff auf den eingerichteten Blob-Speicher |
| `ADMIN_PASSWORD` | Initiales Passwort für die Verwaltung |
| `SESSION_SECRET` | Unabhängiges, zufälliges Geheimnis zur Sitzungssignierung |
| `NEXT_PUBLIC_BASE_URL` | Basisadresse für Karten, QR-Codes und Links |
| `RESEND_API_KEY` | Versand der Kontakt-E-Mails |

Für Tests eine eigene Speicherumgebung und Testkontaktdaten verwenden. Wallet-Zertifikate und Service-Account-Schlüssel werden nur für die optionalen Wallet-Funktionen benötigt. Die Einrichtung steht in [WALLET_SETUP.md](WALLET_SETUP.md).

## Wichtige Bereiche

| Pfad | Aufgabe |
| --- | --- |
| `src/app/card/[slug]` | Öffentliche Visitenkarten und Designs |
| `src/app/admin` | Verwaltung, Gestaltung und Auswertung |
| `src/app/api` | Kontakte, Karten, QR-Codes und Wallet-Endpunkte |
| `src/lib/storage.ts` | Zugriff auf den Blob-Speicher |
| `src/lib/auth.ts` | Anmeldung und Passwortprüfung |

## Entwicklungsstand

Die Anwendung enthält Funktionen für den internen Einsatz. Die Trennung öffentlicher Kartendaten von internen Authentifizierungs- und Kontaktdaten im Speicher muss vor einem weiteren produktiven Einsatz überarbeitet werden. Gleichzeitige Änderungen an JSON-Daten benötigen ebenfalls eine gesonderte Prüfung. Eine automatisierte Testsuite ist derzeit nicht enthalten.

```bash
npm run lint
npm run build
npm start
```

Ein erfolgreicher Build ersetzt keine Prüfung von Anmeldung, Zugriffsrechten, Kontaktversand und Wallet-Pässen in der vorgesehenen Umgebung.
