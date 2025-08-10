import { Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { env } from '../config/env.js';

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(8),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

function signAccessToken(userId: string) {
  return jwt.sign({ sub: userId }, env.jwtSecret, { expiresIn: '15m' });
}

function signRefreshToken(userId: string) {
  return jwt.sign({ sub: userId }, env.jwtRefreshSecret, { expiresIn: '30d' });
}

export async function registerController(req: Request, res: Response) {
  try {
    const { name, email, password } = registerSchema.parse(req.body);

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ status: 'error', message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);

    return res.status(201).json({ status: 'ok', user: { id: user.id, name: user.name, email: user.email }, token, refreshToken });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

export async function loginController(req: Request, res: Response) {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    user.lastLogin = new Date();
    await user.save();

    const token = signAccessToken(user.id);
    const refreshToken = signRefreshToken(user.id);
    return res.json({ status: 'ok', token, refreshToken, user: { id: user.id, name: user.name } });
  } catch (err: any) {
    if (err?.issues) {
      return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

export async function forgotPasswordController(_req: Request, res: Response) {
  // Placeholder: integrate with SES + token storage
  return res.json({ status: 'ok' });
}

export async function resetPasswordController(_req: Request, res: Response) {
  // Placeholder: validate reset token, update passwordHash
  return res.json({ status: 'ok' });
}