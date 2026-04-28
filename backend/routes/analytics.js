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
// Feed last 30 days of reports to Gemini Flash → predictive crisis alerts
// ─────────────────────────────────────────────────────────────
router.get('/predict', async (req, res) => {
  try {
    // Wrap in a 25-second timeout — Gemini can be slow on first cold wake
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), 25000)
    );
    const predictions = await Promise.race([generatePredictions(), timeoutPromise]);
    return res.json({
      success: true,
      predictions,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    if (err.message === 'TIMEOUT') {
      // Return a graceful fallback instead of a 500 error
      return res.json({
        success: true,
        predictions: [{
          region: 'Analysis Pending',
          prediction: 'Gemini is still warming up. Please try again in 30 seconds.',
          probability: 0,
          recommended_action: 'Refresh this page in a few seconds to get live AI predictions.',
          urgency_forecast: 1,
          trend: 'stable',
        }],
        generated_at: new Date().toISOString(),
        note: 'timeout_fallback',
      });
    }
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
