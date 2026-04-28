const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const supabase = require('../config/supabase');
const upload = require('../middleware/upload');
const { parseFieldReportImage } = require('../services/geminiVision.service');
const { transcribeAudio, extractFromTranscript } = require('../services/speechToText.service');

// ─────────────────────────────────────────────────────────────
// POST /api/reports/ingest
// Image upload → Gemini Vision OCR → Supabase INSERT
// ─────────────────────────────────────────────────────────────
router.post('/ingest', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded. Use field name "file".' });
  }

  const filePath = req.file.path;
  const mimeType = req.file.mimetype;

  try {
    // Step 1: Gemini Vision parses the image
    const parsed = await parseFieldReportImage(filePath, mimeType);

    // Step 2: Insert into Supabase
    const reportData = {
      location_name: parsed.location_name || 'Unknown',
      issue_description: parsed.issue_description || '',
      required_skills: parsed.required_skills || [],
      urgency_level: Math.min(5, Math.max(1, parseInt(parsed.urgency_level) || 3)),
      ingestion_type: 'image',
      status: 'pending_review',
      // Build PostGIS point if coordinates were extracted
      ...(parsed.lat && parsed.lng
        ? { location: `SRID=4326;POINT(${parsed.lng} ${parsed.lat})` }
        : {}),
    };

    const { data: report, error } = await supabase
      .from('field_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;

    // Cleanup: remove temp upload file
    fs.unlink(filePath, () => {});

    return res.status(201).json({
      success: true,
      message: 'Field report ingested successfully via image OCR.',
      report,
      ai_extracted: parsed,
    });
  } catch (err) {
    fs.unlink(filePath, () => {});
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// POST /api/reports/ingest/voice
// Audio upload → STT transcription → Gemini extraction → Supabase INSERT
// ─────────────────────────────────────────────────────────────
router.post('/ingest/voice', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No audio file uploaded. Use field name "file".' });
  }

  const filePath = req.file.path;

  try {
    // Step 1: Transcribe audio (stub or real GCP STT)
    const transcript = await transcribeAudio(filePath);

    // Step 2: Gemini extracts structure from transcript
    const parsed = await extractFromTranscript(transcript);

    // Step 3: Insert into Supabase
    const reportData = {
      location_name: parsed.location_name || 'Unknown',
      issue_description: parsed.issue_description || '',
      required_skills: parsed.required_skills || [],
      urgency_level: Math.min(5, Math.max(1, parseInt(parsed.urgency_level) || 3)),
      ingestion_type: 'voice',
      status: 'pending_review',
      ...(parsed.lat && parsed.lng
        ? { location: `SRID=4326;POINT(${parsed.lng} ${parsed.lat})` }
        : {}),
    };

    const { data: report, error } = await supabase
      .from('field_reports')
      .insert(reportData)
      .select()
      .single();

    if (error) throw error;

    fs.unlink(filePath, () => {});

    return res.status(201).json({
      success: true,
      message: 'Field report ingested successfully via voice.',
      report,
      transcript,
      ai_extracted: parsed,
    });
  } catch (err) {
    fs.unlink(filePath, () => {});
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/reports
// All reports sorted by urgency DESC. Supports ?status= filter.
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  let query = supabase
    .from('field_reports')
    .select('*')
    .order('urgency_level', { ascending: false })
    .order('created_at', { ascending: false });

  if (req.query.status) {
    query = query.eq('status', req.query.status);
  }

  const { data, error } = await query;
  if (error) return res.status(500).json({ error: error.message });
  return res.json({ reports: data, count: data.length });
});

// ─────────────────────────────────────────────────────────────
// GET /api/reports/:id
// Single report with full ai_match_result JSONB
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  const { data, error } = await supabase
    .from('field_reports')
    .select('*')
    .eq('id', req.params.id)
    .single();

  if (error) return res.status(404).json({ error: 'Report not found.' });
  return res.json({ report: data });
});

// ─────────────────────────────────────────────────────────────
// PATCH /api/reports/:id/status
// Update report status through the workflow
// Body: { status: 'open' | 'assigned' | 'in_progress' | 'resolved' }
// ─────────────────────────────────────────────────────────────
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending_review', 'open', 'assigned', 'in_progress', 'resolved'];

  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const { data, error } = await supabase
    .from('field_reports')
    .update({ status })
    .eq('id', req.params.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  return res.json({ success: true, report: data });
});

module.exports = router;
