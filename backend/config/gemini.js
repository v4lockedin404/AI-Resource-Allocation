const { GoogleGenerativeAI } = require('@google/generative-ai');

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('Missing GEMINI_API_KEY in environment variables.');
}

const genAI = new GoogleGenerativeAI(apiKey);

// gemini-1.5-flash: fast, cost-efficient — used for Vision OCR and text extraction
const flashModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// gemini-1.5-pro: powerful reasoning — used for volunteer matching and analytics
const proModel = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

module.exports = { genAI, flashModel, proModel };
