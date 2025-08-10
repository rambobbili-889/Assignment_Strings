import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { presignS3Put } from '../services/s3.js';
import { randomUUID } from 'crypto';

const router = Router();

router.post('/presign', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ contentType: z.string(), prefix: z.string().optional().default('uploads') });
  try {
    const input = schema.parse(req.body);
    const key = `${input.prefix}/${req.userId}/${Date.now()}-${randomUUID()}`;
    const presigned = await presignS3Put(key, input.contentType);
    if (!presigned) return res.status(501).json({ status: 'error', message: 'S3 not configured' });
    res.json(presigned);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;