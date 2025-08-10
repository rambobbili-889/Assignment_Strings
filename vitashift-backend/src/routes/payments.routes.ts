import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { getStripe } from '../services/stripe.js';

const router = Router();

router.post('/create-session', requireAuth, async (req: AuthenticatedRequest, res) => {
  const schema = z.object({ plan: z.string(), userId: z.string().optional() });
  try {
    const input = schema.parse(req.body);
    const stripe = getStripe();
    if (!stripe) {
      return res.status(201).json({ sessionId: 'cs_test_' + Date.now(), checkoutUrl: 'https://checkout.stripe.com/test/session' });
    }
    const priceId = input.plan === 'premium_monthly' ? process.env.STRIPE_PRICE_MONTHLY : process.env.STRIPE_PRICE_ANNUAL;
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://app.vitashift/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://app.vitashift/upgrade',
      client_reference_id: req.userId,
    });
    res.status(201).json({ sessionId: session.id, checkoutUrl: session.url });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/status/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const stripe = getStripe();
  if (!stripe) return res.json({ status: 'pending', id: req.params.id });
  try {
    const session = await stripe.checkout.sessions.retrieve(req.params.id);
    res.json({ status: session.status, id: session.id });
  } catch {
    res.status(404).json({ status: 'error', message: 'Not found' });
  }
});

export default router;