import { Scenario } from '../models/Scenario.js';
import { logger } from '../utils/logger.js';

export function startInprocessSimulationWorker() {
  const intervalMs = 1000;
  const timer = setInterval(async () => {
    try {
      const scenario = await Scenario.findOne({ status: 'queued' }).sort({ createdAt: 1 });
      if (!scenario) return;
      scenario.status = 'processing';
      await scenario.save();
      // Simulate processing time
      await new Promise(r => setTimeout(r, 500));
      const baseYear = new Date().getFullYear();
      scenario.result = {
        outcome_timeline: [
          { year: baseYear, event: `Started: ${scenario.input_scenario}` },
          { year: baseYear + 1, event: 'Adjusted to change' },
          { year: baseYear + 3, event: 'Reached stability' },
        ],
        metrics: { wealth: Math.round(Math.random() * 100), happiness: Math.round(Math.random() * 100), risk: Math.round(Math.random() * 100) },
      };
      scenario.status = 'done';
      scenario.processedAt = new Date();
      await scenario.save();
      logger.info({ scenarioId: scenario.id }, 'Scenario processed');
    } catch (err) {
      logger.error({ err }, 'Worker error');
    }
  }, intervalMs);
  return () => clearInterval(timer);
}