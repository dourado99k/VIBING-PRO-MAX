import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { formatUser } from '../services/authService.js';
import { getLevelTitle, xpProgressInLevel } from '../utils/levelSystem.js';
import { getLearningProgress } from '../services/gamificationService.js';
import { getOrgId, isOrgAdmin } from '../middleware/auth.js';

export async function getProfile(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id || req.user.id },
      include: {
        userBadges: { include: { badge: true } },
        userSkills: { include: { skill: true } },
        streak: true,
        ranking: true,
        missions: { where: { status: 'COMPLETED' }, take: 10 },
      },
    });
    if (!user) throw new AppError('Usuário não encontrado', 404);
    const { password, ...safe } = user;
    const skills = user.userSkills;
    res.json({
      success: true,
      user: {
        ...safe,
        levelTitle: getLevelTitle(user.level),
        xpProgress: xpProgressInLevel(user.xp, user.level),
        careerMap: getLearningProgress(user, skills),
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const schema = z.object({
      name: z.string().min(2).optional(),
      bio: z.string().max(500).optional(),
      avatar: z.string().url().optional().or(z.literal('')),
    });
    const data = schema.parse(req.body);
    const user = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.bio !== undefined && { bio: data.bio }),
        ...(data.avatar !== undefined && { avatar: data.avatar || null }),
      },
    });
    const { password, ...safe } = user;
    res.json({ success: true, user: formatUser(safe) });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { organizationId: getOrgId(req.user) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        plan: true,
        xp: true,
        level: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, users });
  } catch (e) {
    next(e);
  }
}

export async function updateUser(req, res, next) {
  try {
    const schema = z.object({
      role: z.enum(['USER', 'ADMIN']).optional(),
      plan: z.enum(['FREE', 'PREMIUM']).optional(),
      xp: z.number().int().min(0).optional(),
      level: z.number().int().min(1).optional(),
    });
    const data = schema.parse(req.body);
    const user = await prisma.user.update({ where: { id: req.params.id }, data });
    const { password, ...safe } = user;
    res.json({ success: true, user: safe });
  } catch (e) {
    next(e);
  }
}

export async function deleteUser(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Usuário removido' });
  } catch (e) {
    next(e);
  }
}

export async function getDashboard(req, res, next) {
  try {
    const userId = req.user.id;
    const [user, missions, streak, ranking] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        include: {
          organization: true,
          userBadges: { include: { badge: true } },
          userSkills: { include: { skill: true }, where: { unlocked: true } },
        },
      }),
      prisma.mission.findMany({
        where: { userId, status: { not: 'COMPLETED' } },
        orderBy: { deadline: 'asc' },
        take: 5,
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.ranking.findUnique({ where: { userId } }),
    ]);

    const weeklyXp = await prisma.mission.groupBy({
      by: ['status'],
      where: {
        userId,
        updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        status: 'COMPLETED',
      },
      _sum: { xpReward: true },
    });

    const allSkills = await prisma.userSkill.findMany({
      where: { userId },
      include: { skill: true },
    });

    const missionsCompleted = await prisma.mission.count({
      where: { userId, status: 'COMPLETED' },
    });
    const totalContents = await prisma.content.count({
      where: { organizationId: user.organizationId, isPublished: true },
    });

    const { password, ...safe } = user;
    const stats = {
      missionsCompleted,
      skillsUnlocked: user.userSkills.length,
      badgesEarned: user.userBadges.length,
      totalContents,
      contentsEngaged: Math.min(missionsCompleted, totalContents),
    };

    res.json({
      success: true,
      dashboard: {
        user: {
          ...safe,
          levelTitle: getLevelTitle(user.level),
          xpProgress: xpProgressInLevel(user.xp, user.level),
        },
        organization: user.organization,
        dailyMissions: missions,
        streak: streak || { currentStreak: 0, longestStreak: 0 },
        rankingPosition: ranking?.position || 0,
        weeklyXp: weeklyXp[0]?._sum?.xpReward || 0,
        unlockedSkills: user.userSkills,
        badges: user.userBadges,
        careerMap: getLearningProgress(user, allSkills, stats),
        stats,
      },
    });
  } catch (e) {
    next(e);
  }
}
