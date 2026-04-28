const { proModel } = require('../config/gemini');
const supabase = require('../config/supabase');

/**
 * Fetches the last 30 days of field reports and uses Gemini Pro to generate
 * predictive crisis alerts and recommended actions.
 *
 * @returns {Promise<Array>} Array of 3-5 prediction objects
 */
async function generatePredictions() {
  // Fetch recent reports from Supabase
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();

  const { data: reports, error } = await supabase
    .from('field_reports')
    .select('location_name, urgency_level, required_skills, issue_description, status, created_at')
    .gte('created_at', thirtyDaysAgo)
    .order('created_at', { ascending: false });

  if (error) throw new Error(`Failed to fetch reports for analytics: ${error.message}`);

  if (!reports || reports.length === 0) {
    return [{
      region: 'No Data',
      prediction: 'Not enough historical data to generate predictions yet.',
      probability: 0,
      recommended_action: 'Ingest more field reports to enable predictive analytics.',
      urgency_forecast: 1,
    }];
  }

  const prompt = `
You are a data analyst and crisis prediction specialist for an NGO emergency response system.
Analyze the following field reports from the last 30 days and identify emerging crisis patterns.

FIELD REPORTS DATA (${reports.length} reports):
${JSON.stringify(reports, null, 2)}

Based on this data:
1. Identify geographic regions with increasing incident frequency
2. Detect recurring skill shortages
3. Predict likely future crisis hotspots

Return ONLY a valid JSON array of 3-5 prediction objects. No markdown, no explanation outside the JSON:
[
  {
    "region": "string — specific city/region name",
    "prediction": "string — what crisis is likely to emerge or escalate",
    "probability": number 0-100 (your confidence percentage),
    "recommended_action": "string — specific actionable recommendation for the NGO",
    "urgency_forecast": number 1-5 (predicted urgency level),
    "trend": "increasing" | "stable" | "decreasing"
  }
]
`;

  const result = await proModel.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Returns aggregate counts for the dashboard analytics summary.
 * @returns {Promise<Object>}
 */
async function getAnalyticsSummary() {
  const [
    { count: totalReports },
    { data: byStatus },
    { data: byUrgency },
    { count: totalVolunteers },
    { count: availableVolunteers },
  ] = await Promise.all([
    supabase.from('field_reports').select('*', { count: 'exact', head: true }),
    supabase.from('field_reports').select('status'),
    supabase.from('field_reports').select('urgency_level'),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }).eq('availability', true),
  ]);

  // Aggregate status counts
  const statusCounts = { pending_review: 0, open: 0, assigned: 0, in_progress: 0, resolved: 0 };
  (byStatus || []).forEach(r => { if (statusCounts[r.status] !== undefined) statusCounts[r.status]++; });

  // Aggregate urgency counts
  const urgencyCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  (byUrgency || []).forEach(r => { if (urgencyCounts[r.urgency_level] !== undefined) urgencyCounts[r.urgency_level]++; });

  return {
    total_reports: totalReports || 0,
    by_status: statusCounts,
    by_urgency: urgencyCounts,
    total_volunteers: totalVolunteers || 0,
    available_volunteers: availableVolunteers || 0,
  };
}

module.exports = { generatePredictions, getAnalyticsSummary };
