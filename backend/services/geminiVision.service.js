const { flashModel } = require('../config/gemini');
const fs = require('fs');

/**
 * Parses a field report image using Gemini Vision (gemini-1.5-flash).
 * Returns a structured JSON object extracted from the image content.
 *
 * @param {string} filePath - Absolute path to the uploaded image file
 * @param {string} mimeType - MIME type of the image (e.g. 'image/jpeg')
 * @returns {Promise<Object>} Structured field report data
 */
async function parseFieldReportImage(filePath, mimeType = 'image/jpeg') {
  const imageBuffer = fs.readFileSync(filePath);
  const imageBase64 = imageBuffer.toString('base64');

  const prompt = `
You are an AI assistant for an NGO field operations system.
Analyze this field report image (which may be handwritten, typed, or a photograph of a disaster scene).

Extract the following information and return ONLY a valid JSON object with no markdown code fences, no extra text, just pure JSON:
{
  "location_name": "string — city, region, or area name mentioned in the report",
  "lat": number or null,
  "lng": number or null,
  "urgency_level": number (1=low priority to 5=life-threatening critical),
  "required_skills": ["array", "of", "skill", "strings from this list: medical, first_aid, triage, water_sanitation, logistics, food_distribution, construction, shelter, counseling, mental_health, education, teaching, child_care, nutrition, it_support, data_management, community_outreach, cooking, communication, heavy_lifting"],
  "issue_description": "string — 2-3 sentence concise summary of the problem requiring volunteer assistance"
}

Rules:
- If lat/lng cannot be reliably inferred from the location name, return null for those fields.
- urgency_level must be an integer between 1 and 5.
- required_skills must be an array of strings (can be empty if unclear).
- Do NOT include any explanation outside the JSON object.
`;

  const imagePart = {
    inlineData: {
      data: imageBase64,
      mimeType,
    },
  };

  const result = await flashModel.generateContent([prompt, imagePart]);
  const text = result.response.text().trim();

  // Strip any accidental markdown fences
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { parseFieldReportImage };
