import { z } from 'zod';
import * as authService from '../services/authService.js';
import { AppError } from '../utils/AppError.js';

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  accountType: z.enum(['ORG_ADMIN', 'USER']).default('USER'),
  organizationName: z.string().optional(),
  organizationSlug: z.string().optional(),
  industry: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function register(req, res, next) {
  try {
    const data = registerSchema.parse(req.body);
    const result = await authService.register(data);
    res.status(201).json({ success: true, ...result });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function login(req, res, next) {
  try {
    const data = loginSchema.parse(req.body);
    const result = await authService.login(data);
    res.json({ success: true, ...result });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function me(req, res) {
  res.json({ success: true, user: authService.formatUser(req.user) });
}

export async function organizations(req, res, next) {
  try {
    const orgs = await authService.listOrganizations();
    res.json({ success: true, organizations: orgs });
  } catch (e) {
    next(e);
  }
}
