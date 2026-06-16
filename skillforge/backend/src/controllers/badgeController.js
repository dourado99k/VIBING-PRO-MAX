import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getOrgId } from '../middleware/auth.js';

export async function list(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Organização não vinculada', 400);
    const badges = await prisma.badge.findMany({
      where: { organizationId: orgId },
      orderBy: { name: 'asc' },
    });
    let userBadges = [];
    if (req.user) {
      userBadges = await prisma.userBadge.findMany({
        where: { userId: req.user.id },
        include: { badge: true },
      });
    }
    res.json({ success: true, badges, userBadges });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string(),
      icon: z.string().optional(),
      xpBonus: z.number().int().optional(),
      isPremium: z.boolean().optional(),
    });
    const data = schema.parse(req.body);
    const badge = await prisma.badge.create({
      data: { ...data, organizationId: getOrgId(req.user) },
    });
    res.status(201).json({ success: true, badge });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function update(req, res, next) {
  try {
    const badge = await prisma.badge.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, badge });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.badge.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Badge removida' });
  } catch (e) {
    next(e);
  }
}

export async function award(req, res, next) {
  try {
    const { userId, badgeId } = req.body;
    const existing = await prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId } },
    });
    if (existing) throw new AppError('Badge já concedida', 400);
    const userBadge = await prisma.userBadge.create({
      data: { userId, badgeId },
      include: { badge: true },
    });
    res.status(201).json({ success: true, userBadge });
  } catch (e) {
    next(e);
  }
}
