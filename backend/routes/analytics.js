const express = require('express');
const router = express.Router();
const { getAnalyticsSummary, generatePredictions } = require('../services/geminiAnalytics.service');

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/summary
// Dashboard KPI aggregates: counts by status, urgency, volunteers
// ─────────────────────────────────────────────────────────────
router.get('/summary', async (req, res) => {
  try {
    const summary = await getAnalyticsSummary();
    return res.json({ success: true, summary });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────────────────────────
// GET /api/analytics/predict
// Feed last 30 days of reports to Gemini Pro → predictive crisis alerts
// Note: This calls Gemini Pro, so it may take 3-8 seconds.
// ─────────────────────────────────────────────────────────────
router.get('/predict', async (req, res) => {
  try {
    const predictions = await generatePredictions();
    return res.json({
      success: true,
      predictions,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
