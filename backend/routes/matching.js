const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { runMatchingPipeline } = require('../services/geminiMatching.service');

// ─────────────────────────────────────────────────────────────
// POST /api/match/:reportId
// Two-stage AI matching:
//   Stage 1: PostGIS proximity filter (supabase RPC)
//   Stage 2: Gemini Pro skill + reputation ranking
// Returns top 3 matched volunteers and saves to report
// ─────────────────────────────────────────────────────────────
router.post('/:reportId', async (req, res) => {
  const { reportId } = req.params;

  // Fetch the report to match
  const { data: report, error: fetchError } = await supabase
    .from('field_reports')
    .select('*')
    .eq('id', reportId)
    .single();

  if (fetchError || !report) {
    return res.status(404).json({ error: 'Report not found.' });
  }

  // Extract lat/lng from PostGIS geography column
  // Supabase returns geography as WKB hex — we need to decode or use an alternate approach.
  // Strategy: Use Supabase RPC or ST_AsText to get coords if not stored separately.
  // For MVP: Store lat/lng separately or use ST_X/ST_Y via a custom RPC.
  // Here we attempt to parse from the raw WKB or use coords from ai_extracted if available.

  // Attempt to get coords via Supabase RPC
  const { data: coords, error: coordError } = await supabase
    .rpc('get_report_coords', { report_id: reportId });

  let reportWithCoords = { ...report };

  if (!coordError && coords && coords.length > 0) {
    reportWithCoords.lat = coords[0].lat;
    reportWithCoords.lng = coords[0].lng;
  }

  // If report has no coordinates, matching cannot use proximity (will use fallback)
  try {
    const matches = await runMatchingPipeline(reportWithCoords);

    return res.json({
      success: true,
      report_id: reportId,
      matches,
      message: `AI matched ${matches.length} volunteer(s) using PostGIS proximity + Gemini Pro ranking.`,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/match/:reportId
// Retrieve previously computed match results for a report
// ─────────────────────────────────────────────────────────────
router.get('/:reportId', async (req, res) => {
  const { data: report, error } = await supabase
    .from('field_reports')
    .select('id, location_name, urgency_level, status, ai_match_result, assigned_volunteer_ids')
    .eq('id', req.params.reportId)
    .single();

  if (error) return res.status(404).json({ error: 'Report not found.' });

  if (!report.ai_match_result) {
    return res.status(200).json({
      report_id: report.id,
      matches: null,
      message: 'No AI matching has been run for this report yet. POST to /api/match/:reportId to trigger.',
    });
  }

  return res.json({
    report_id: report.id,
    status: report.status,
    matches: report.ai_match_result,
  });
});

module.exports = router;
