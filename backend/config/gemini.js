const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// gemini-2.5-flash: fast, cost-efficient — used for Vision OCR and text extraction
const flashModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

// Downgraded pro to flash to avoid free-tier rate limits (429 limit: 0) on the user's API key
const proModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

module.exports = { genAI, flashModel, proModel };
