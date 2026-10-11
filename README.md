# HealthCopilot

An account based health record organizer for the hackathon brief. Features include Google sign in, family profiles, encrypted document storage, OCR and image extraction, plain language summaries, extracted lab values and medicines, profile scoped health questions, persistent Doctor Visit Prep lists, browser push reminders, trends, printable reports, and FHIR-style JSON export.

## Run locally

Requirements: Node.js 22 or newer and PostgreSQL 14 or newer.

1. Create a PostgreSQL database named `healthcopilot`.
2. Run `npm ci`.
3. Copy `.env.example` to `.env`. Set `DATABASE_URL`, Google OAuth credentials, `APP_ORIGIN=http://localhost:5274`, `GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/callback/google`, `SESSION_SECRET`, and `DOCUMENT_ENCRYPTION_KEY`.
4. Generate app secrets with `npm run secrets` and put the generated values in `.env`.
5. For Groq, set `AI_PROVIDER=groq`, `GROQ_API_KEY`, and `ENABLE_EXTERNAL_AI=true`. In Settings, enable external AI for each profile. Do not put keys in frontend files or commit `.env`.
6. In Google Cloud Console, add `http://localhost:5274` as an authorized origin and `http://localhost:3000/api/auth/callback/google` as an authorized redirect URI.
7. Run `npm run db:setup`, then `npm run dev`. Open `http://localhost:5274`.

### Use VS Code Live Server (Go Live)

The workspace Live Server settings proxy requests through the app server so sign-in and `/api` routes work from the Go Live origin. Run `npm run dev:live` in the VS Code terminal, then open `index.html` and click **Go Live**. Live Server is set to `http://localhost:5274`, matching the local Google OAuth origin. Stop `npm run dev` first if it is already using that port. `dev:live` builds the frontend, applies the database schema, and starts the API server; rerun it after frontend source changes so `dist` is rebuilt.

## Groq models and voice

The default text model is `openai/gpt-oss-120b`; image/OCR requests use `qwen/qwen3.8-27b`; voice transcription uses `whisper-large-v3-turbo`. Override these with `GROQ_MEDICAL_MODEL`, `GROQ_VISION_MODEL`, and `GROQ_STT_MODEL`. Separate optional keys are `GROQ_MEDICAL_API_KEY` and `GROQ_VOICE_API_KEY`; if unset, the server uses `GROQ_API_KEY`.

The Groq configuration uses browser-installed voices for spoken answers to avoid a paid TTS endpoint. Playback requires the selected language voice to be installed on the device. Voice transcription is sent to Groq only after the profile's external AI consent is enabled. The browser recording is not stored by this app. Groq's hosted model availability, pricing, quotas, and eligibility can change; check the provider console before relying on a free allowance.

## Railway deployment

`railway.json` configures the build, startup, and `/healthz` health check. In Railway:

1. Create a project and deploy this GitHub repository as a service.
2. Add a PostgreSQL service. In the web service Variables, set `DATABASE_URL` to the Railway reference `${{Postgres.DATABASE_URL}}` (use the actual PostgreSQL service name if different).
3. Set `NODE_ENV=production`, `APP_ORIGIN=https://YOUR-SERVICE.up.railway.app`, `TRUST_PROXY=true`, `AI_PROVIDER=groq`, `ENABLE_EXTERNAL_AI=true`, and the Groq model values shown above.
4. Set `SESSION_SECRET` and `DOCUMENT_ENCRYPTION_KEY` to secure, stable random values. Never rotate the encryption key after storing records unless you have migrated the encrypted data.
5. Add your Google OAuth `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. In Google Cloud Console, add the Railway origin and redirect URI `https://YOUR-SERVICE.up.railway.app/api/auth/callback/google`.
6. Optionally configure `VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, and `VAPID_SUBJECT` for push reminders. Generate a VAPID pair locally with `npm run push:keys`; add the values as Railway variables, then redeploy.
7. Redeploy and open the Railway-generated public domain. The startup command applies the database schema before starting the server.

Railway plan pricing and included credits can change; check Railway's current plan before deployment. Keep database backups and the encryption key separate from the database. Do not put `.env` or secrets in GitHub.

## Data and clinical limits

User documents and extracted content are encrypted before PostgreSQL storage. Profile queries check both the signed-in user and active profile. When external AI is enabled, only the specific question, relevant profile facts, uploaded image or audio needed for the requested feature are sent to the configured provider. Use synthetic records for judging.

This is a hackathon information tool, not a doctor or a certified medical device. OCR and extraction can be wrong, particularly for handwriting and low quality scans. Verify every extracted fact against its source. The interaction checker covers only a small set of patterns; a missing warning does not establish safety. This app does not diagnose or prescribe. Seek a qualified clinician for care decisions and emergency services for emergencies.

The ABHA-style ID is a mock local identifier, not an ABDM connection. FHIR output is a FHIR-style bundle and is not a claim of ABDM or FHIR certification.

## Submission materials

- Architecture and judge demo script: [`docs/SUBMISSION.md`](docs/SUBMISSION.md)
- Database model: [`db/schema.sql`](db/schema.sql)
- Railway deployment config: [`railway.json`](railway.json)
