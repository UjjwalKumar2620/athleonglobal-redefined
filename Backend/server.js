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
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || 'http://localhost:8000',
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));

// ─── Routes ───
app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'Athleon Backend' });
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

app.listen(PORT, () => {
  console.log(`\n🚀 Athleon Backend running at http://localhost:${PORT}`);
  console.log(`   OpenRouter: ${process.env.OPENROUTER_API_KEY ? '✅ Connected' : '❌ Missing key'}`);
  console.log(`   Supabase:   ${process.env.SUPABASE_URL ? '✅ Connected' : '⚠️  Not configured'}\n`);
});
