// ═══════════════════════════════════════════
// ATHLEON GLOBAL — BACKEND SERVER (DEPLOYMENT READY)
// ═══════════════════════════════════════════
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const chatRouter = require('./routes/chat');
const uploadRouter = require('./routes/upload');
const analyzeRouter = require('./routes/analyze');

const app = express();
const PORT = process.env.PORT || 8000; // Use port from environment (Render/Railway/Vercel)

// ─── Middleware ───
const allowedOrigins = [
  process.env.ALLOWED_ORIGIN, // Production Front-end URL
  'http://localhost:3000',    // Local dev
  'http://localhost:5173',    // Vite dev
  'http://localhost:8000',    // Local backend
  'http://127.0.0.1:5173',    // Alternative local Vite
].filter(Boolean);

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in the allowed list or is a localhost subdomain
    const isLocalhost = origin.includes('localhost') || origin.includes('127.0.0.1');
    if (isLocalhost || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback for easier development; set to strict in production
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// ─── Routes ───
app.use('/api/chat', chatRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/analyze', analyzeRouter);

// ─── Health check ───
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: "OK", server: "Athleon Backend is Live 🚀" });
});

// ─── Default route for root API ───
app.get('/api', (req, res) => {
  res.json({ message: "Athleon Global API is running. Use /api/chat, /api/upload, or /api/analyze." });
});

// ─── 404 handler ───
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ─── Global Error handler ───
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ─── Server Listen ───
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Athleon Backend running at http://0.0.0.0:${PORT}`);
    console.log(`   Endpoints configured: /api/chat, /api/upload, /api/analyze`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app; // Export for serverless or testing
