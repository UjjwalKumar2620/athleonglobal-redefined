// ═══════════════════════════════════════════
// ATHLEON GLOBAL — BACKEND SERVER
// ═══════════════════════════════════════════
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const uploadRouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN, // Production (GitHub Pages)
  'http://localhost:8000',
  'http://localhost:3000',
  'http://127.0.0.1:8000',
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    // Allow any localhost or the explicit production origin
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    if (isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// ─── Routes ───
app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);

// ─── Health check (Vercel compatible) ───
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK" });
});

// ─── 404 ───
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Error handler ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Export for Vercel / conditional listen for local ───
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`\n🚀 Athleon Backend running locally at http://localhost:${PORT}`);
    console.log(`   OpenRouter: ${process.env.OPENROUTER_API_KEY ? '✅ Connected' : '❌ Missing key'}`);
    console.log(`   Supabase:   ${process.env.SUPABASE_URL ? '✅ Connected' : '⚠️  Not configured'}\n`);
  });
}

module.exports = app;
