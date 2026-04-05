// ═══════════════════════════════════════════
// UPLOAD ROUTE — Supabase Storage Proxy
// ═══════════════════════════════════════════
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');

// Use memory storage for small assets (optional) or just move everything to signed URLs
// Given the 4.5MB limit, signed URLs are safer for everything.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 4 * 1024 * 1024 } // 4MB limit to stay under Vercel's 4.5MB
});

function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    return null;
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);
}

// ─── NEW: Signed URL Generator (For Direct Frontend Upload) ───
// POST /api/upload/signed-url
router.post('/signed-url', async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) {
      return res.status(503).json({ error: 'Storage not configured.' });
    }

    const { fileName, bucketName = 'videos' } = req.body;
    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    console.log(`🔐 Generating signed upload URL for: ${bucketName}/${fileName}`);

    // Create a signed upload URL that expires in 60 seconds
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    return res.json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: fileName
    });

  } catch (err) {
    console.error('Signed URL error:', err);
    return res.status(500).json({ error: 'Failed to generate signed URL', message: err.message });
  }
});

// POST /api/upload/asset (Remain for small files < 4MB if needed, but signed URLs are preferred)
router.post('/asset', upload.single('file'), async (req, res) => {
  try {
    const supabase = getSupabase();
    if (!supabase) return res.status(503).json({ error: 'Storage not configured' });
    if (!req.file) return res.status(400).json({ error: 'No file provided' });

    const userId = req.body.userId || 'anonymous';
    const type = req.body.type || 'misc';
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
      type
    });

  } catch (err) {
    console.error('Asset upload error:', err);
    return res.status(500).json({ error: 'Upload failed', message: err.message });
  }
});

module.exports = router;

module.exports = router;
