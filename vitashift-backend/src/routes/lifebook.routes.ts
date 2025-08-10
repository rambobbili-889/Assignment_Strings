import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { Memory } from '../models/Memory.js';
import { z } from 'zod';

const router = Router();

router.get('/timeline', requireAuth, async (req: AuthenticatedRequest, res) => {
  const memories = await Memory.find({ userId: req.userId, deletedAt: null }).sort({ date: -1 }).limit(200);
  res.json(memories);
});

const addSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  media: z.array(z.object({ url: z.string().url(), s3Key: z.string().optional(), thumbUrl: z.string().optional() })).optional().default([]),
  date: z.string(),
  tags: z.array(z.string()).optional().default([]),
  mood: z.number().min(0).max(10).optional(),
});

router.post('/add', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const input = addSchema.parse(req.body);
    const created = await Memory.create({
      userId: req.userId,
      title: input.title,
      description: input.description,
      media: input.media,
      date: new Date(input.date),
      tags: input.tags,
      mood: input.mood,
      visibility: 'private',
    });
    res.status(201).json(created);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const mem = await Memory.findOne({ _id: id, userId: req.userId });
  if (!mem) return res.status(404).json({ status: 'error', message: 'Not found' });
  mem.deletedAt = new Date();
  await mem.save();
  res.json({ status: 'ok' });
});

export default router;