import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

const router = Router();

router.post('/create-session', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ plan: z.string(), userId: z.string().optional() });
  try {
    const input = schema.parse(req.body);
    // TODO: Integrate Stripe to create checkout session
    res.status(201).json({ sessionId: 'cs_test_' + Date.now(), checkoutUrl: 'https://checkout.stripe.com/test/session' });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/status/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  // TODO: Query Stripe for session/payment status
  res.json({ status: 'pending', id: req.params.id });
});

export default router;