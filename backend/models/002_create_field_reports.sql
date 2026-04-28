-- ============================================================
-- Migration 002: Create field_reports table
-- Run this in Supabase SQL Editor AFTER migration 001
-- ============================================================

CREATE TABLE IF NOT EXISTS field_reports (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- AI-extracted structured fields from Gemini Vision / STT
  location_name         TEXT,
  issue_description     TEXT,
  required_skills       TEXT[] NOT NULL DEFAULT '{}',
  urgency_level         SMALLINT NOT NULL CHECK (urgency_level BETWEEN 1 AND 5),

  -- Geospatial: extracted or reverse-geocoded coordinates
  location              GEOGRAPHY(POINT, 4326),

  -- Extended status workflow
  status                TEXT NOT NULL DEFAULT 'pending_review'
                        CHECK (status IN (
                          'pending_review',
                          'open',
                          'assigned',
                          'in_progress',
                          'resolved'
                        )),

  -- Source tracking (image or voice)
  ingestion_type        TEXT DEFAULT 'image'
                        CHECK (ingestion_type IN ('image', 'voice')),
  source_file_url       TEXT,   -- Supabase Storage public URL (if uploaded)

  -- Volunteer assignment: simple UUID array for MVP
  assigned_volunteer_ids UUID[] DEFAULT '{}',

  -- AI match results snapshot — flexible JSONB for top-3 matches
  ai_match_result       JSONB,

  created_at            TIMESTAMPTZ DEFAULT NOW(),
  updated_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for geospatial proximity
CREATE INDEX IF NOT EXISTS field_reports_location_gist ON field_reports USING GIST (location);

-- Index for fast dashboard sorting by urgency
CREATE INDEX IF NOT EXISTS field_reports_urgency_idx ON field_reports (urgency_level DESC);

-- Index for status filtering
CREATE INDEX IF NOT EXISTS field_reports_status_idx ON field_reports (status);

-- Auto-update updated_at on row modification
CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_field_reports_updated_at
  BEFORE UPDATE ON field_reports
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_volunteers_updated_at
  BEFORE UPDATE ON volunteers
  FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
