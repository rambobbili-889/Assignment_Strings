import { env } from '../config/env.js';

export function getStripe() {
  if (!env.stripeSecretKey) return null;
  // dynamic import to avoid bundling when not used
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Stripe = require('stripe');
  return new Stripe(env.stripeSecretKey, { apiVersion: '2024-06-20' });
}