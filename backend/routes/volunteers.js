const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// ─────────────────────────────────────────────────────────────
// POST /api/volunteers
// Register a new volunteer
// Body: { name, email, phone, skills[], lat, lng, city, hours_available }
// ─────────────────────────────────────────────────────────────
router.post('/', async (req, res) => {
  const { name, email, phone, skills, lat, lng, city, hours_available } = req.body;

  if (!name || !email || !skills || !Array.isArray(skills)) {
    return res.status(400).json({ error: 'name, email, and skills (array) are required.' });
  }

  const volunteerData = {
    name,
    email,
    phone: phone || null,
    skills,
    city: city || null,
    hours_available: parseInt(hours_available) || 0,
    availability: true,
    // Build PostGIS geography point if coords provided
    ...(lat && lng
      ? { location: `SRID=4326;POINT(${lng} ${lat})` }
      : {}),
  };

  const { data, error } = await supabase
    .from('volunteers')
    .insert(volunteerData)
    .select()
    .single();

  if (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A volunteer with this email already exists.' });
    }
    return res.status(500).json({ error: error.message });
  }

  return res.status(201).json({ success: true, volunteer: data });
});

// ─────────────────────────────────────────────────────────────
// GET /api/volunteers
// List all volunteers. Supports ?available=true filter.
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  let query = supabase
    .from('volunteers')
    .select('id, name, email, phone, city, skills, availability, hours_available, tasks_completed, reputation_points, badges, created_at')
    .order('reputation_points', { ascending: false });

  if (req.query.available === 'true') {
    query = query.eq('availability', true);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ volunteers: data, count: data.length });
});

// ─────────────────────────────────────────────────────────────
// GET /api/volunteers/:id
// Single volunteer profile
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Volunteer not found.' });
  return res.json({ volunteer: data });
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/volunteers/:id
// Update skills, availability, or award reputation points / badges
// Body: { skills?, availability?, hours_available?, reputation_points?, badges? }
// ─────────────────────────────────────────────────────────────
router.patch('/:id', async (req, res) => {
  const { skills, availability, hours_available, reputation_points, badges } = req.body;

  const updates = {};
  if (skills !== undefined) updates.skills = skills;
  if (availability !== undefined) updates.availability = availability;
  if (hours_available !== undefined) updates.hours_available = parseInt(hours_available);
  if (reputation_points !== undefined) updates.reputation_points = parseInt(reputation_points);
  if (badges !== undefined) updates.badges = badges;

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No valid update fields provided.' });
  }

  const { data, error } = await supabase
    .from('volunteers')
    .update(updates)
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true, volunteer: data });
});

// ─────────────────────────────────────────────────────────────
// POST /api/volunteers/:id/complete-task
// Mark a task completed: increments tasks_completed + awards 50 rep points
// ─────────────────────────────────────────────────────────────
router.post('/:id/complete-task', async (req, res) => {
  // First get current values
  const { data: volunteer, error: fetchError } = await supabase
    .from('volunteers')
    .select('tasks_completed, reputation_points')
    .eq('id', req.params.id)
    .single();

  if (fetchError) return res.status(404).json({ error: 'Volunteer not found.' });

  const { data, error } = await supabase
    .from('volunteers')
    .update({
      tasks_completed: volunteer.tasks_completed + 1,
      reputation_points: volunteer.reputation_points + 50,
    })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true, volunteer: data, message: '+50 reputation points awarded.' });
});

module.exports = router;
