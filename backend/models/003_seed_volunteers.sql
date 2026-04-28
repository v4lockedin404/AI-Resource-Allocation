-- ============================================================
-- Migration 003: Seed 8 realistic volunteers across Indian cities
-- Run in Supabase SQL Editor AFTER migration 001
-- ============================================================

INSERT INTO volunteers (name, email, phone, skills, location, city, hours_available, reputation_points, badges) VALUES
(
  'Arjun Mehta', 'arjun@ngo.org', '+91-9810001234',
  ARRAY['medical','first_aid','triage'],
  ST_SetSRID(ST_MakePoint(77.2090, 28.6139), 4326)::geography,
  'New Delhi', 20, 450, ARRAY['first_responder']
),
(
  'Divya Rao', 'divya@ngo.org', '+91-9444005678',
  ARRAY['water_sanitation','logistics','community_outreach'],
  ST_SetSRID(ST_MakePoint(80.2707, 13.0827), 4326)::geography,
  'Chennai', 15, 320, ARRAY['sanitation_expert']
),
(
  'Rohan Verma', 'rohan@ngo.org', '+91-9820009012',
  ARRAY['counseling','mental_health','education'],
  ST_SetSRID(ST_MakePoint(72.8777, 19.0760), 4326)::geography,
  'Mumbai', 30, 210, ARRAY['mentor']
),
(
  'Sneha Pillai', 'sneha@ngo.org', '+91-9886003456',
  ARRAY['food_distribution','logistics','cooking'],
  ST_SetSRID(ST_MakePoint(77.5946, 12.9716), 4326)::geography,
  'Bangalore', 10, 180, ARRAY[]::text[]
),
(
  'Karan Singh', 'karan@ngo.org', '+91-9425007890',
  ARRAY['construction','shelter','logistics','heavy_lifting'],
  ST_SetSRID(ST_MakePoint(75.8577, 22.7196), 4326)::geography,
  'Indore', 25, 390, ARRAY['builder']
),
(
  'Ananya Das', 'ananya@ngo.org', '+91-9830001234',
  ARRAY['medical','nutrition','child_care','triage'],
  ST_SetSRID(ST_MakePoint(88.3639, 22.5726), 4326)::geography,
  'Kolkata', 20, 500, ARRAY['first_responder','medic_expert']
),
(
  'Vikram Nair', 'vikram@ngo.org', '+91-9447005678',
  ARRAY['it_support','data_management','communication'],
  ST_SetSRID(ST_MakePoint(76.9366, 8.5241), 4326)::geography,
  'Thiruvananthapuram', 40, 150, ARRAY[]::text[]
),
(
  'Meera Joshi', 'meera@ngo.org', '+91-9822009012',
  ARRAY['education','teaching','child_care','counseling'],
  ST_SetSRID(ST_MakePoint(73.8567, 18.5204), 4326)::geography,
  'Pune', 15, 275, ARRAY['mentor']
)
ON CONFLICT (email) DO NOTHING;
