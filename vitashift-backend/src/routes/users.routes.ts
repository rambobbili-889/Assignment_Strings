import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { User } from '../models/User.js';

const router = Router();

router.get('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ status: 'error', message: 'Not found' });
  res.json({ id: user._id, name: user.name, email: user.email, privacy_mode: user.privacyMode, created_at: user.createdAt });
});

router.patch('/me', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ name: z.string().optional(), privacy_mode: z.enum(['private', 'public']).optional() });
  try {
    const input = schema.parse(req.body);
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ status: 'error', message: 'Not found' });
    if (input.name) user.name = input.name;
    if (input.privacy_mode) user.privacyMode = input.privacy_mode;
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email, privacy_mode: user.privacyMode });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.post('/logout', requireAuth, async (_req, res) => {
  // With stateless JWT access tokens, client deletes tokens; optionally revoke refresh
  res.json({ status: 'ok' });
});

router.post('/delete', requireAuth, async (req: AuthenticatedRequest, res) => {
  // Danger operation; for MVP we can hard delete, later add soft-delete and async purge
  await User.deleteOne({ _id: req.userId });
  res.json({ status: 'ok' });
});

export default router;