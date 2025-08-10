import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { Timeline } from '../models/Timeline.js';

const router = Router();

const milestoneSchema = z.object({ id: z.string(), title: z.string(), date: z.string(), desc: z.string().optional(), category: z.string().optional(), order: z.number().optional() });

router.post('/', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ title: z.string(), milestones: z.array(milestoneSchema).default([]) });
  try {
    const input = schema.parse(req.body);
    const created = await Timeline.create({ userId: req.userId, title: input.title, milestones: input.milestones.map(m => ({ ...m, date: new Date(m.date) })) });
    res.status(201).json({ id: created.id });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const tl = await Timeline.findOne({ _id: req.params.id, userId: req.userId });
  if (!tl) return res.status(404).json({ status: 'error', message: 'Not found' });
  res.json(tl);
});

router.patch('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ title: z.string().optional(), milestones: z.array(milestoneSchema).optional() });
  try {
    const input = schema.parse(req.body);
    const tl = await Timeline.findOne({ _id: req.params.id, userId: req.userId });
    if (!tl) return res.status(404).json({ status: 'error', message: 'Not found' });
    if (input.title) tl.title = input.title;
    if (input.milestones) tl.milestones = input.milestones.map(m => ({ ...m, date: new Date(m.date) }));
    await tl.save();
    res.json(tl);
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.delete('/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const tl = await Timeline.findOneAndDelete({ _id: req.params.id, userId: req.userId });
  if (!tl) return res.status(404).json({ status: 'error', message: 'Not found' });
  res.json({ status: 'ok' });
});

export default router;