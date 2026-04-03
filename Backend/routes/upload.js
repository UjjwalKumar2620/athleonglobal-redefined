// ═══════════════════════════════════════════
// UPLOAD ROUTE — Supabase Storage Proxy
// ═══════════════════════════════════════════
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Use memory storage so files go directly to Supabase
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB
});

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return null;
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// POST /api/upload/video
router.post('/video', upload.single('file'), async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in .env' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = req.body.userId || 'anonymous';
    const timestamp = Date.now();
    const ext = req.file.originalname.split('.').pop();
    const filename = `${userId}/${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from('videos')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('videos').getPublicUrl(filename);

    return res.json({
      success: true,
      path: filename,
      publicUrl: urlData.publicUrl,
      size: req.file.size,
      originalName: req.file.originalname
    });

  } catch (err) {
    console.error('Video upload error:', err);
    return res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

// POST /api/upload/asset (for profile photos, certs, achievements)
router.post('/asset', upload.single('file'), async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const userId = req.body.userId || 'anonymous';
    const type = req.body.type || 'misc'; // 'photo', 'cert', 'achievement'
    const timestamp = Date.now();
    const ext = req.file.originalname.split('.').pop();
    const filename = `${userId}/${type}/${timestamp}.${ext}`;

    const { data, error } = await supabase.storage
      .from('profile-assets')
      .upload(filename, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: true
      });

    if (error) throw error;

    const { data: urlData } = supabase.storage.from('profile-assets').getPublicUrl(filename);

    return res.json({
      success: true,
      path: filename,
      publicUrl: urlData.publicUrl,
      type,
      originalName: req.file.originalname
    });

  } catch (err) {
    console.error('Asset upload error:', err);
    return res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

module.exports = router;
