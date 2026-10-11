CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS app_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_sub text NOT NULL UNIQUE,
  email text NOT NULL,
  display_name text NOT NULL,
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS family_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  name text NOT NULL CHECK (length(name) BETWEEN 1 AND 120),
  relationship text NOT NULL DEFAULT 'Self',
  date_of_birth date,
  abha_mock_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS family_profiles_owner_idx ON family_profiles(owner_id, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS family_profiles_id_owner_idx ON family_profiles(id, owner_id);

CREATE TABLE IF NOT EXISTS profile_state (
  profile_id uuid PRIMARY KEY REFERENCES family_profiles(id) ON DELETE CASCADE,
  state_ciphertext bytea NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS health_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES family_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  document_type text NOT NULL CHECK (document_type IN ('Prescription','Lab report','Discharge summary','Diagnostic report','Other')),
  document_date date NOT NULL,
  summary_ciphertext bytea,
  extracted_ciphertext bytea NOT NULL,
  original_ciphertext bytea,
  original_mime text,
  original_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS health_documents_profile_date_idx ON health_documents(profile_id, document_date DESC);

CREATE TABLE IF NOT EXISTS medicine_reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id uuid NOT NULL REFERENCES family_profiles(id) ON DELETE CASCADE,
  medicine_name text NOT NULL,
  directions text NOT NULL DEFAULT '',
  frequency text NOT NULL DEFAULT 'As prescribed',
  reminder_time time NOT NULL,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS reminders_profile_idx ON medicine_reminders(profile_id, enabled);
ALTER TABLE medicine_reminders ADD COLUMN IF NOT EXISTS last_triggered_at timestamptz;

CREATE TABLE IF NOT EXISTS push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES family_profiles(id) ON DELETE CASCADE,
  endpoint text NOT NULL,
  p256dh text NOT NULL,
  auth text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, profile_id, endpoint),
  FOREIGN KEY (profile_id, user_id) REFERENCES family_profiles(id, owner_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS push_subscriptions_scope_idx ON push_subscriptions(user_id, profile_id);

CREATE TABLE IF NOT EXISTS audit_events (
  id bigserial PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  profile_id uuid REFERENCES family_profiles(id) ON DELETE SET NULL,
  action text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS audit_events_user_time_idx ON audit_events(user_id, created_at DESC);

-- Visit preparation is stored per account and active family profile.
CREATE TABLE IF NOT EXISTS visit_prep_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES family_profiles(id) ON DELETE CASCADE,
  visit_date date,
  doctor_name text NOT NULL DEFAULT '' CHECK (length(doctor_name) <= 160),
  reason text NOT NULL DEFAULT '' CHECK (length(reason) <= 500),
  notes text NOT NULL DEFAULT '' CHECK (length(notes) <= 12000),
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  source_fingerprint text NOT NULL DEFAULT '',
  generated_language text NOT NULL DEFAULT 'en' CHECK (generated_language IN ('en','hi')),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, profile_id)
);
CREATE INDEX IF NOT EXISTS visit_prep_sessions_scope_idx ON visit_prep_sessions(user_id, profile_id);

CREATE TABLE IF NOT EXISTS visit_prep_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES app_users(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES family_profiles(id) ON DELETE CASCADE,
  text text NOT NULL CHECK (length(text) BETWEEN 1 AND 300),
  category text NOT NULL CHECK (category IN ('labs','medicines','diagnosis','general')),
  reason text NOT NULL DEFAULT '' CHECK (length(reason) <= 500),
  source_ref text,
  is_asked boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  is_custom boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  FOREIGN KEY (profile_id, user_id) REFERENCES family_profiles(id, owner_id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS visit_prep_questions_scope_idx ON visit_prep_questions(user_id, profile_id, sort_order);

-- Every API query must first prove profile ownership through app_users.id.
-- No endpoint may select health_documents by document id without joining family_profiles.
