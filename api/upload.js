// ═══════════════════════════════════════════
// ATHLEON UPLOAD — SIGNED URL SERVICE
// ═══════════════════════════════════════════

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_KEY || ''
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { fileName, bucketName = 'videos' } = req.body;

    if (!fileName) {
      return res.status(400).json({ error: 'fileName is required' });
    }

    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      return res.status(503).json({ error: 'Supabase configuration missing' });
    }

    console.log(`🔐 Generating signed upload URL: ${bucketName}/${fileName}`);

    // Create signed upload URL that expires in 60 seconds
    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUploadUrl(fileName);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      signedUrl: data.signedUrl,
      token: data.token,
      path: fileName
    });

  } catch (err) {
    console.error('Serverless upload error:', err);
    return res.status(500).json({ error: 'Failed to generate signed URL', message: err.message });
  }
}
