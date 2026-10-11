# Ayush- (HealthCopilot)

An account based health record organizer for the hackathon brief. It supports Google sign in, family profiles, PDF/JPG/PNG/WebP/TXT/CSV health record uploads, English/Hindi OCR, manual records, plain language summaries, extracted lab values and medicines, date filtered trends, profile scoped Health Agent Q&A, a clearly limited medicine-pattern checker, persistent Doctor Visit Prep checklists, system push reminders, printable reports, and a FHIR-style JSON export. Language preference supports English, Hindi, Telugu, Tamil, Kannada, and Malayalam for generated summaries and Health Agent answers. The Doctor Visit Prep question generator currently supports English and Hindi. Speech uses configured AI voice for Health Agent conversation; visit questions use installed browser voices and clearly reports when the selected voice is unavailable.

## Run locally

Requirements: Node.js 24.x and PostgreSQL 14 or newer. Create an empty local database named `healthcopilot` first. In pgAdmin, connect to the PostgreSQL server with the password you chose in the installer, right-click **Databases → Create → Database**, enter `healthcopilot`, and save. Docker is not required.

1. Install dependencies: `npm ci`
2. Create `.env` from `.env.example` if it does not already exist. In the project-root `.env`, set `DATABASE_URL=postgresql://postgres:URL_ENCODED_PASSWORD@localhost:5432/healthcopilot`, replacing `URL_ENCODED_PASSWORD` with your installer password. Keep `.env` private. If the password contains URL-reserved characters such as `@`, `:`, `/`, `?`, `#`, or `%`, percent-encode those characters in the URL.
3. Generate secrets with `npm run secrets`; paste both generated values into `.env`.
4. Set `DATABASE_URL`, `APP_ORIGIN=http://localhost:5274`, Google OAuth client ID/secret, and `GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/callback/google`.
5. In Google Cloud Console, configure the OAuth consent screen and add `http://localhost:5274` as an authorized JavaScript origin and `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI. Keep the app in testing mode and add hackathon testers.
6. Apply the database schema: `npm run db:setup`
7. Start both servers: `npm run dev`; open `http://localhost:5274`. Port 5274 is selected to avoid common apps already using Vite's default port 5173.

Gemini is optional. Create an API key in Google AI Studio and set `GEMINI_API_KEY` plus `ENABLE_EXTERNAL_AI=true`; then, for each profile, explicitly opt in under Settings. `GEMINI_MEDICAL_API_KEY` and `GEMINI_VOICE_API_KEY` can override the shared key, while `GEMINI_MEDICAL_MODEL` and `GEMINI_TTS_MODEL` select their models. Medical chat, summaries, and image/PDF extraction default to `gemini-3.8-flash`; speech output uses `gemini-3.8-flash-lite-tts` through the Interactions API. Both models currently have free tiers with quota limits. Google says unpaid prompts/files may be used to improve its products and the Gemini API must not be used to provide medical advice. Use free-tier AI only for synthetic hackathon records and clearly non-clinical health information; do not present HealthCopilot as a doctor or use it for real medical decisions. With AI disabled, uploads use local OCR and heuristic extraction, and chat uses a limited local record search.

Push reminders require the VAPID public/private key pair. Generate a pair with `npm run push:keys` (the script writes the keys to the local `.env` without printing them), restart the server, then grant notification permission and enable push on the Reminders page. Browser push requires localhost or HTTPS. For Render/Railway, set `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` as server environment variables, then redeploy. Keep the same VAPID pair across deploys so existing device subscriptions remain valid. Reminders are sent once per local calendar day while the server is running; delivery depends on the browser, operating system, and push service.

Generate new secrets if you accidentally expose them. Keep `.env` private and never commit it. The document encryption key is essential: losing it makes previously encrypted document contents unreadable. Back it up securely outside the database.

## Render deployment

`render.yaml` provisions the web service and PostgreSQL database. Push this repository to a private GitHub repository, connect that repository in Render, select **Blueprint**, and apply the blueprint. Enter the Google OAuth, Gemini, and VAPID values in Render's secret prompts/dashboard. The app applies the idempotent database schema as part of startup, so the free web plan does not rely on Render's paid-only pre-deploy command. After Render creates the service, copy its exact `https://…onrender.com` origin into Google OAuth's authorized origin, and its `/auth/google/callback` URL into authorized redirect URIs. Confirm `APP_ORIGIN` equals that exact service origin. Redeploy after changing OAuth settings.

The blueprint currently selects Render's free web and database plans to make hackathon setup inexpensive. Render free PostgreSQL expires after 30 days and has no backups; this is not durable storage for regular use. Before using it as a regular service, move to a paid database with backups and retention, configure monitoring, and rehearse restore. Do not upload real patient records to the free hackathon instance.

## What is stored and sent

- Google OAuth identifies the account; all profile/document operations verify ownership on the server.
- Original files, OCR text, extracted facts, summaries, and profile settings are encrypted with AES-256-GCM before storage in PostgreSQL. HTTPS is provided by Render in deployment.
- Google receives the authentication flow. Gemini receives questions, recent chat, voice audio, uploaded documents/images and relevant profile facts only when server configuration and per-profile consent enable it. Free-tier prompts and files may be used to improve Google products; use synthetic records for this tier.
- The mock ABHA-style ID is a local placeholder and is not verified or connected to ABDM.
- Reminder times and visit preparation questions/notes are saved per family profile. Push notifications can arrive while the page is closed when the configured server and browser push service are available; delivery is not guaranteed and is not a pharmacy service.

## Voice conversation

The Health Agent voice flow records a question in the browser, sends temporary audio to Gemini for transcription, sends the transcript and consented profile context to Gemini for an answer, then requests generated speech in the selected language. The app does not save the recording. Browser recording requires microphone permission and localhost or HTTPS. Multilingual transcription and speech quality can vary by language and accent; verify the displayed transcript before relying on an answer.

Voice models can be changed with `GEMINI_MEDICAL_MODEL`, `GEMINI_TTS_MODEL`, and `GEMINI_TTS_VOICE` in the server environment. AI must be enabled in Settings for that profile.

## Scope and clinical safety

This is a hackathon submission, not a certified medical device or clinical service. OCR and extraction are heuristic and can be wrong, especially on handwriting, poor scans, uncommon lab layouts, and medicine names. Always verify extracted content against the original. Reference-range flags repeat the source report; they are not diagnoses. The interaction checker covers only a few patterns and a “no match” result never establishes safety. Summaries do not prescribe or replace professional advice. Use fictional/synthetic documents for judging.

FHIR export is an interoperability-oriented FHIR-style Bundle with Patient, DocumentReference, Observation, and MedicationStatement resources. It is not an ABDM connection or a claim of conformance certification; validate against the target FHIR/ABDM implementation before integration.

## Submission materials

- Architecture, data flow, and a judge-facing demo script: [`docs/SUBMISSION.md`](docs/SUBMISSION.md)
- Database model: [`db/schema.sql`](db/schema.sql)
- Render blueprint: [`render.yaml`](render.yaml)

