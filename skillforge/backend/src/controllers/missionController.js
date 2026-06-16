import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { addXpToUser, updateStreak, tryAwardBadge } from '../services/gamificationService.js';
import { getOrgId, isOrgAdmin } from '../middleware/auth.js';

const missionSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(5),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'BOSS']).optional(),
  xpReward: z.number().int().positive().optional(),
  category: z.string().min(2),
  status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']).optional(),
  deadline: z.string().datetime().optional().nullable(),
  isBoss: z.boolean().optional(),
});

const DIFFICULTY_XP = { EASY: 50, MEDIUM: 100, HARD: 200, BOSS: 500 };

async function attachFavorites(userId, missions) {
  const ids = missions.map((m) => m.id);
  if (!ids.length) return missions.map((m) => ({ ...m, isFavorite: false }));

  const favorites = await prisma.missionFavorite.findMany({
    where: { userId, missionId: { in: ids } },
    select: { missionId: true },
  });
  const favSet = new Set(favorites.map((f) => f.missionId));
  return missions.map((m) => ({ ...m, isFavorite: favSet.has(m.id) }));
}

export async function list(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Organização não vinculada', 400);

    const where =
      isOrgAdmin(req.user.role) && req.query.all === 'true'
        ? { organizationId: orgId }
        : { userId: req.user.id, organizationId: orgId };

    if (req.query.favorites === 'true') {
      const favs = await prisma.missionFavorite.findMany({
        where: { userId: req.user.id },
        include: { mission: true },
        orderBy: { createdAt: 'desc' },
      });
      const missions = favs.map((f) => ({ ...f.mission, isFavorite: true }));
      return res.json({ success: true, missions });
    }

    const missions = await prisma.mission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    const withFavorites = await attachFavorites(req.user.id, missions);
    res.json({ success: true, missions: withFavorites });
  } catch (e) {
    next(e);
  }
}

export async function toggleFavorite(req, res, next) {
  try {
    const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!mission) throw new AppError('Missão não encontrada', 404);
    if (mission.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Sem permissão', 403);
    }

    const existing = await prisma.missionFavorite.findUnique({
      where: { userId_missionId: { userId: req.user.id, missionId: mission.id } },
    });

    if (existing) {
      await prisma.missionFavorite.delete({ where: { id: existing.id } });
      return res.json({ success: true, isFavorite: false, message: 'Removido dos favoritos' });
    }

    await prisma.missionFavorite.create({
      data: { userId: req.user.id, missionId: mission.id },
    });
    res.json({ success: true, isFavorite: true, message: 'Adicionado aos favoritos' });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = missionSchema.parse(req.body);
    const xpReward = data.xpReward || DIFFICULTY_XP[data.difficulty || 'EASY'];
    const mission = await prisma.mission.create({
      data: {
        ...data,
        xpReward,
        deadline: data.deadline ? new Date(data.deadline) : null,
        userId: req.user.id,
        organizationId: getOrgId(req.user),
      },
    });
    res.status(201).json({ success: true, mission });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function update(req, res, next) {
  try {
    const data = missionSchema.partial().parse(req.body);
    const existing = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Missão não encontrada', 404);
    if (existing.userId !== req.user.id && !isOrgAdmin(req.user.role)) {
      throw new AppError('Sem permissão', 403);
    }
    const mission = await prisma.mission.update({
      where: { id: req.params.id },
      data: {
        ...data,
        ...(data.deadline !== undefined && {
          deadline: data.deadline ? new Date(data.deadline) : null,
        }),
      },
    });
    res.json({ success: true, mission });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    const existing = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!existing) throw new AppError('Missão não encontrada', 404);
    if (existing.userId !== req.user.id && !isOrgAdmin(req.user.role)) {
      throw new AppError('Sem permissão', 403);
    }
    await prisma.mission.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Missão excluída' });
  } catch (e) {
    next(e);
  }
}

export async function complete(req, res, next) {
  try {
    const mission = await prisma.mission.findUnique({ where: { id: req.params.id } });
    if (!mission) throw new AppError('Missão não encontrada', 404);
    if (mission.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Sem permissão', 403);
    }
    if (mission.status === 'COMPLETED') {
      throw new AppError('Missão já concluída', 400);
    }

    const updated = await prisma.mission.update({
      where: { id: req.params.id },
      data: { status: 'COMPLETED' },
    });

    const xpResult = await addXpToUser(mission.userId, mission.xpReward);
    await updateStreak(mission.userId);

    const completedCount = await prisma.mission.count({
      where: { userId: mission.userId, status: 'COMPLETED' },
    });
    if (completedCount === 1) await tryAwardBadge(mission.userId, 'Primeiro Passo');
    if (mission.isBoss || mission.difficulty === 'BOSS') {
      await tryAwardBadge(mission.userId, 'Boss Slayer');
    }

    res.json({
      success: true,
      mission: updated,
      reward: xpResult,
    });
  } catch (e) {
    next(e);
  }
}
