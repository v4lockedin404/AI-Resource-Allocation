require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const reportsRouter = require('./routes/reports');
const volunteersRouter = require('./routes/volunteers');
const matchingRouter = require('./routes/matching');
const analyticsRouter = require('./routes/analytics');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: '*', // Allow all origins for MVP to prevent Network Errors
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Routes ───────────────────────────────────────────────────
app.use('/api/reports', reportsRouter);
app.use('/api/volunteers', volunteersRouter);
app.use('/api/match', matchingRouter);
app.use('/api/analytics', analyticsRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'AI Resource Allocation Backend',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// ── 404 handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// ── Global error handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

// ── Start server ─────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🚀 AI Resource Allocation Backend running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
