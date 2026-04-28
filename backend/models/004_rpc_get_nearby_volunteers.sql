-- ============================================================
-- Migration 004: Supabase RPC for PostGIS proximity search
-- Run in Supabase SQL Editor AFTER migrations 001 & 002
-- ============================================================

-- Returns available volunteers within a given radius (km) of a report location.
-- Called from the backend as: supabase.rpc('get_nearby_volunteers', { report_lat, report_lng, radius_km })
CREATE OR REPLACE FUNCTION get_nearby_volunteers(
  report_lat FLOAT,
  report_lng FLOAT,
  radius_km  FLOAT DEFAULT 200
)
RETURNS TABLE (
  id                UUID,
  name              TEXT,
  email             TEXT,
  phone             TEXT,
  city              TEXT,
  skills            TEXT[],
  availability      BOOLEAN,
  hours_available   INTEGER,
  tasks_completed   INTEGER,
  reputation_points INTEGER,
  badges            TEXT[],
  created_at        TIMESTAMPTZ,
  updated_at        TIMESTAMPTZ,
  distance_km       FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.name,
    v.email,
    v.phone,
    v.city,
    v.skills,
    v.availability,
    v.hours_available,
    v.tasks_completed,
    v.reputation_points,
    v.badges,
    v.created_at,
    v.updated_at,
    ROUND(
      CAST(
        ST_Distance(
          v.location,
          ST_SetSRID(ST_MakePoint(report_lng, report_lat), 4326)::geography
        ) / 1000.0
      AS NUMERIC), 1
    )::FLOAT AS distance_km
  FROM volunteers v
  WHERE v.availability = TRUE
    AND v.location IS NOT NULL
    AND ST_DWithin(
      v.location,
      ST_SetSRID(ST_MakePoint(report_lng, report_lat), 4326)::geography,
      radius_km * 1000   -- ST_DWithin uses meters
    )
  ORDER BY ST_Distance(
    v.location,
    ST_SetSRID(ST_MakePoint(report_lng, report_lat), 4326)::geography
  ) ASC
  LIMIT 20;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
