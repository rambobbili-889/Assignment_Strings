import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Missing token' });
  }
  try {
    const decoded = jwt.verify(token, env.jwtSecret) as { sub: string };
    req.userId = decoded.sub;
    return next();
  } catch {
    return res.status(401).json({ status: 'error', message: 'Invalid token' });
  }
}