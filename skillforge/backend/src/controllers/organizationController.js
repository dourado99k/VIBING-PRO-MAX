import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { getOrgId, isOrgAdmin } from '../middleware/auth.js';

export async function getMine(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Sem organização vinculada', 404);
    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        _count: { select: { users: true, contents: true, missions: true } },
      },
    });
    res.json({ success: true, organization: org });
  } catch (e) {
    next(e);
  }
}

export async function updateMine(req, res, next) {
  try {
    if (!isOrgAdmin(req.user.role)) throw new AppError('Sem permissão', 403);
    const orgId = getOrgId(req.user);
    const schema = z.object({
      name: z.string().min(2).optional(),
      description: z.string().optional(),
      industry: z.string().optional(),
      welcomeMessage: z.string().optional(),
      gamificationEnabled: z.boolean().optional(),
      logoUrl: z.string().url().optional().or(z.literal('')),
    });
    const data = schema.parse(req.body);
    const org = await prisma.organization.update({
      where: { id: orgId },
      data: {
        ...data,
        ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl || null }),
      },
    });
    res.json({ success: true, organization: org });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function getStats(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Sem organização', 400);

    const [users, contents, missions, publishedContents] = await Promise.all([
      prisma.user.count({ where: { organizationId: orgId, role: 'USER' } }),
      prisma.content.count({ where: { organizationId: orgId } }),
      prisma.mission.count({ where: { organizationId: orgId } }),
      prisma.content.count({ where: { organizationId: orgId, isPublished: true } }),
    ]);

    res.json({
      success: true,
      stats: { learners: users, contents, publishedContents, missions },
    });
  } catch (e) {
    next(e);
  }
}
