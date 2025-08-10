import { Router } from 'express';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';
import { Scenario } from '../models/Scenario.js';
import { randomUUID } from 'crypto';

const router = Router();

const setupSchema = z.object({
  decision_type: z.string(),
  input_scenario: z.string(),
  variables: z.record(z.union([z.number(), z.string(), z.boolean()])).default({}),
});

router.post('/setup', requireAuth, async (req: AuthenticatedRequest, res) => {
  try {
    const input = setupSchema.parse(req.body);
    const scenario = await Scenario.create({
      userId: req.userId,
      decision_type: input.decision_type,
      input_scenario: input.input_scenario,
      variables: input.variables,
      status: 'queued',
    });

    // TODO: push to SQS or background worker

    res.status(202).json({ scenario_id: scenario.id, status: 'queued' });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
});

router.get('/results/:id', requireAuth, async (req: AuthenticatedRequest, res) => {
  const sc = await Scenario.findOne({ _id: req.params.id, userId: req.userId });
  if (!sc) return res.status(404).json({ status: 'error', message: 'Not found' });
  res.json({ scenario_id: sc.id, outcome_timeline: sc.result?.outcome_timeline ?? [], metrics: sc.result?.metrics ?? {} });
});

export default router;