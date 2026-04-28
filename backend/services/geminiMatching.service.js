const { proModel } = require('../config/gemini');
const supabase = require('../config/supabase');

/**
 * Stage 2: Gemini Pro ranks nearby volunteers by skill match, reputation, and availability.
 *
 * @param {Object} report - The field report object
 * @param {Array} nearbyVolunteers - Volunteers pre-filtered by PostGIS proximity (Stage 1)
 * @returns {Promise<Array>} Top 3 matched volunteers with scores and reasoning
 */
async function rankVolunteers(report, nearbyVolunteers) {
  const volunteerSummaries = nearbyVolunteers.map(v => ({
    id: v.id,
    name: v.name,
    city: v.city,
    distance_km: v.distance_km,
    skills: v.skills,
    hours_available: v.hours_available,
    reputation_points: v.reputation_points,
    badges: v.badges,
  }));

  const prompt = `
You are an AI volunteer coordinator for an NGO emergency response system.

FIELD REPORT:
- Issue: ${report.issue_description}
- Location: ${report.location_name}
- Urgency Level: ${report.urgency_level}/5 (5 = life-threatening critical)
- Required Skills: ${report.required_skills.join(', ')}

AVAILABLE VOLUNTEERS (pre-filtered by geographic proximity, sorted by distance):
${JSON.stringify(volunteerSummaries, null, 2)}

Task: Select the TOP 3 best-matched volunteers from the list above.
Consider these factors in order of priority:
1. Skill overlap with required_skills (most important)
2. Distance proximity (closer is better for urgent situations)
3. Reputation points and badges (higher = more experienced)
4. Hours available (more hours = more flexible)

Return ONLY a valid JSON array with exactly 3 items (or fewer if fewer candidates exist). No markdown, no explanation outside the JSON:
[
  {
    "volunteer_id": "uuid string",
    "name": "string",
    "city": "string",
    "distance_km": number,
    "match_score": integer 0-100,
    "matched_skills": ["array of skills that match the report requirements"],
    "reasoning": "One concise sentence explaining why this volunteer is the best match."
  }
]
`;

  const result = await proModel.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

/**
 * Full two-stage matching pipeline:
 * Stage 1 → PostGIS RPC proximity filter
 * Stage 2 → Gemini Pro skill + reputation ranking
 *
 * @param {Object} report - Field report from Supabase (must include lat, lng, id)
 * @returns {Promise<Array>} Top 3 matched volunteers
 */
async function runMatchingPipeline(report) {
  if (!report.lat || !report.lng) {
    throw new Error('Report does not have valid lat/lng coordinates for matching.');
  }

  // Stage 1: PostGIS proximity — start with 200km radius
  let radius = 200;
  let { data: nearbyVolunteers, error } = await supabase.rpc('get_nearby_volunteers', {
    report_lat: report.lat,
    report_lng: report.lng,
    radius_km: radius,
  });

  if (error) throw new Error(`PostGIS RPC failed: ${error.message}`);

  // Fallback: expand to 500km if fewer than 3 candidates found
  if (!nearbyVolunteers || nearbyVolunteers.length < 3) {
    console.log(`[Matching] Only ${nearbyVolunteers?.length ?? 0} found in 200km — expanding to 500km`);
    const expanded = await supabase.rpc('get_nearby_volunteers', {
      report_lat: report.lat,
      report_lng: report.lng,
      radius_km: 500,
    });
    if (!expanded.error) nearbyVolunteers = expanded.data;
  }

  // Last resort: if still empty, get all available volunteers (ignore location)
  if (!nearbyVolunteers || nearbyVolunteers.length === 0) {
    console.log('[Matching] No volunteers found by proximity — falling back to all available volunteers');
    const fallback = await supabase
      .from('volunteers')
      .select('*')
      .eq('availability', true)
      .order('reputation_points', { ascending: false })
      .limit(20);
    if (!fallback.error) {
      nearbyVolunteers = fallback.data.map(v => ({ ...v, distance_km: null }));
    }
  }

  if (!nearbyVolunteers || nearbyVolunteers.length === 0) {
    throw new Error('No available volunteers found in the system.');
  }

  // Stage 2: Gemini Pro ranks candidates
  const matches = await rankVolunteers(report, nearbyVolunteers);

  // Save snapshot to report and update status to 'assigned'
  await supabase
    .from('field_reports')
    .update({
      ai_match_result: matches,
      assigned_volunteer_ids: matches.map(m => m.volunteer_id),
      status: 'assigned',
    })
    .eq('id', report.id);

  return matches;
}

module.exports = { runMatchingPipeline, rankVolunteers };
