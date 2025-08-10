import { Request, Response } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { env } from '../config/env.js';
import { PasswordResetToken } from '../models/PasswordResetToken.js';
import { sendEmail } from '../services/email.js';

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

export async function forgotPasswordController(req: Request, res: Response) {
  const schema = z.object({ email: z.string().email() });
  try {
    const { email } = schema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) {
      // Respond ok to avoid leaking existence
      return res.json({ status: 'ok' });
    }
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = await bcrypt.hash(rawToken, 12);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
    await PasswordResetToken.deleteMany({ userId: user._id });
    await PasswordResetToken.create({ userId: user._id, tokenHash, expiresAt });
    const resetUrl = `https://app.vitashift/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;
    await sendEmail(email, 'Reset your VitaShift password', `<p>Click to reset: <a href="${resetUrl}">${resetUrl}</a></p>`);
    return res.json({ status: 'ok' });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}

export async function resetPasswordController(req: Request, res: Response) {
  const schema = z.object({ token: z.string(), email: z.string().email(), newPassword: z.string().min(8) });
  try {
    const { token, email, newPassword } = schema.parse(req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ status: 'error', message: 'Invalid token' });
    const prt = await PasswordResetToken.findOne({ userId: user._id, usedAt: null });
    if (!prt || prt.expiresAt < new Date()) return res.status(400).json({ status: 'error', message: 'Invalid or expired token' });
    const match = await bcrypt.compare(token, prt.tokenHash);
    if (!match) return res.status(400).json({ status: 'error', message: 'Invalid token' });
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    prt.usedAt = new Date();
    await prt.save();
    return res.json({ status: 'ok' });
  } catch (err: any) {
    if (err?.issues) return res.status(400).json({ status: 'error', message: 'Invalid input', details: err.issues });
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
  }
}