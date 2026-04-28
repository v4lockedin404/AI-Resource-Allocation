const { flashModel } = require('../config/gemini');
const fs = require('fs');

/**
 * Speech-to-Text service.
 *
 * STATUS: STUB — Google Cloud Speech-to-Text requires a GCP project with the
 * Speech-to-Text API enabled and a service account JSON key.
 *
 * To activate:
 * 1. Enable the Speech-to-Text API in your Google Cloud Console.
 * 2. Create a service account, download the JSON key.
 * 3. Set GOOGLE_APPLICATION_CREDENTIALS=./gcp-service-account.json in .env
 * 4. Uncomment the real implementation below and remove the mock.
 */

// ── REAL IMPLEMENTATION (uncomment when GCP is configured) ──────────────────
//
// const speech = require('@google-cloud/speech');
// const client = new speech.SpeechClient();
//
// async function transcribeAudio(filePath, encoding = 'LINEAR16', sampleRateHertz = 16000) {
//   const audioBytes = fs.readFileSync(filePath).toString('base64');
//   const request = {
//     config: {
//       encoding,
//       sampleRateHertz,
//       languageCode: 'en-IN',
//       alternativeLanguageCodes: ['hi-IN'],
//       enableAutomaticPunctuation: true,
//     },
//     audio: { content: audioBytes },
//   };
//   const [response] = await client.recognize(request);
//   return response.results.map(r => r.alternatives[0].transcript).join('\n');
// }
// ─────────────────────────────────────────────────────────────────────────────

/**
 * STUB: Simulates transcription for demo purposes.
 * Returns a plausible field report transcript based on the filename.
 */
async function transcribeAudio(filePath) {
  console.warn('[SpeechToText] Running in STUB mode — no GCP credentials configured.');
  return `Field report from Rajasthan district. There is an urgent medical emergency at the village. 
  Multiple children showing symptoms of dehydration and malnutrition. We need medical volunteers 
  with first aid experience immediately. Urgency is critical. Location: Barmer, Rajasthan.`;
}

/**
 * Extracts structured field report data from a voice transcript using Gemini.
 * @param {string} transcript - The transcribed voice text
 * @returns {Promise<Object>} Structured field report JSON
 */
async function extractFromTranscript(transcript) {
  const prompt = `
You are an AI assistant for an NGO field operations system.
A field worker has submitted a voice report. Below is the transcribed text:

"${transcript}"

Extract the following information and return ONLY a valid JSON object with no markdown:
{
  "location_name": "string — city, region, or area name mentioned",
  "lat": number or null,
  "lng": number or null,
  "urgency_level": number (1=low to 5=critical),
  "required_skills": ["array", "of", "skill", "strings"],
  "issue_description": "string — 2-3 sentence summary of the problem"
}

If lat/lng cannot be reliably inferred, return null. Do not include any explanation outside the JSON.
`;

  const result = await flashModel.generateContent(prompt);
  const text = result.response.text().trim();
  const cleaned = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
  return JSON.parse(cleaned);
}

module.exports = { transcribeAudio, extractFromTranscript };
