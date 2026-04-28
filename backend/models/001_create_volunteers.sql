-- ============================================================
-- Migration 001: Create volunteers table
-- Run this in Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- Step 1: Enable PostGIS extension (must be done first)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Step 2: Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name              TEXT NOT NULL,
  email             TEXT UNIQUE NOT NULL,
  phone             TEXT,

  -- Geospatial: PostGIS GEOGRAPHY point (lng, lat) — SRID 4326
  location          GEOGRAPHY(POINT, 4326),
  city              TEXT,

  -- Skills stored as a PostgreSQL array for native containment queries
  skills            TEXT[] NOT NULL DEFAULT '{}',

  availability      BOOLEAN NOT NULL DEFAULT TRUE,
  hours_available   INTEGER DEFAULT 0,
  tasks_completed   INTEGER DEFAULT 0,

  -- Gamification layer
  reputation_points INTEGER NOT NULL DEFAULT 0,
  badges            TEXT[] NOT NULL DEFAULT '{}',  -- e.g. ['first_responder', 'medic_expert']

  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index for fast proximity queries (ST_DWithin, ST_Distance)
CREATE INDEX IF NOT EXISTS volunteers_location_gist ON volunteers USING GIST (location);

-- Index for fast availability filtering
CREATE INDEX IF NOT EXISTS volunteers_availability_idx ON volunteers (availability);
