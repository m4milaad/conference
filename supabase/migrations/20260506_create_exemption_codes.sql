-- Late fee exemption codes table
CREATE TABLE IF NOT EXISTS exemption_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(32) NOT NULL UNIQUE,
  label TEXT,
  created_by VARCHAR(50),                -- admin username who generated the code
  used_by_registration_id VARCHAR(50) REFERENCES registrations(registration_id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  used_at TIMESTAMPTZ
);

-- Index for fast code lookup during validation
CREATE INDEX IF NOT EXISTS idx_exemption_codes_code ON exemption_codes (code);

-- ── Row Level Security ──────────────────────────────────────────────
-- All access to this table is through edge functions using the service role key,
-- which bypasses RLS. Enable RLS with deny-all defaults so that the anon key
-- (exposed in the frontend) cannot read or mutate exemption codes directly
-- via the Supabase REST API.
ALTER TABLE exemption_codes ENABLE ROW LEVEL SECURITY;

-- No policies = deny all for anon/authenticated roles.
-- Service role key (used by edge functions) bypasses RLS entirely.
-- This is the same security model used by the admins, registrations, and
-- committee tables in this project.
