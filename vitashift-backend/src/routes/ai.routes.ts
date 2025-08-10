import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.post('/analyze', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ userId: z.string().optional(), timelineId: z.string().optional(), options: z.any().optional() });
  try {
    const _ = schema.parse(req.body);
    // TODO: Call OpenAI and generate insights, persist to DB
    res.status(201).json({ insightId: 'ins_' + Date.now(), summary: 'Placeholder insight', key_actions: ['Reflect on recent milestones', 'Consider saving 10% income'] });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/feedback', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ insightId: z.string(), rating: z.number().min(1).max(5), comments: z.string().optional() });
  try {
    const input = schema.parse(req.body);
    // TODO: Persist feedback
    res.json({ status: 'ok' });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

export default router;