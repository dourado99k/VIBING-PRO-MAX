import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { addXpToUser, tryAwardBadge } from '../services/gamificationService.js';
import { getOrgId } from '../middleware/auth.js';

export async function list(req, res, next) {
  try {
    const orgId = getOrgId(req.user);
    if (!orgId) throw new AppError('Organização não vinculada', 400);

    const skills = await prisma.skill.findMany({
      where: { organizationId: orgId },
      include: { children: true, parent: true },
      orderBy: [{ category: 'asc' }, { requiredLevel: 'asc' }],
    });

    let userSkills = [];
    if (req.user) {
      userSkills = await prisma.userSkill.findMany({
        where: { userId: req.user.id },
      });
    }

    const map = Object.fromEntries(userSkills.map((us) => [us.skillId, us]));

    res.json({
      success: true,
      skills: skills.map((s) => ({
        ...s,
        unlocked: map[s.id]?.unlocked || false,
        unlockedAt: map[s.id]?.unlockedAt,
      })),
    });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const schema = z.object({
      name: z.string().min(2),
      description: z.string(),
      category: z.enum(['FRONTEND', 'BACKEND', 'DATABASE', 'SOFT_SKILLS', 'DEVOPS', 'CUSTOM']),
      requiredLevel: z.number().int().min(1).optional(),
      xpRequired: z.number().int().min(0).optional(),
      parentId: z.string().optional(),
      positionX: z.number().optional(),
      positionY: z.number().optional(),
    });
    const data = schema.parse(req.body);
    const skill = await prisma.skill.create({
      data: { ...data, organizationId: getOrgId(req.user) },
    });
    res.status(201).json({ success: true, skill });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function update(req, res, next) {
  try {
    const skill = await prisma.skill.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json({ success: true, skill });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Skill removida' });
  } catch (e) {
    next(e);
  }
}

export async function unlock(req, res, next) {
  try {
    const skill = await prisma.skill.findUnique({ where: { id: req.params.id } });
    if (!skill) throw new AppError('Skill não encontrada', 404);

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.level < skill.requiredLevel) {
      throw new AppError(`Nível ${skill.requiredLevel} necessário`, 400);
    }
    if (user.xp < skill.xpRequired) {
      throw new AppError(`XP insuficiente (${skill.xpRequired} necessário)`, 400);
    }

    const userSkill = await prisma.userSkill.upsert({
      where: { userId_skillId: { userId: req.user.id, skillId: skill.id } },
      create: { userId: req.user.id, skillId: skill.id, unlocked: true, unlockedAt: new Date() },
      update: { unlocked: true, unlockedAt: new Date() },
    });

    const xpResult = await addXpToUser(req.user.id, Math.floor(skill.xpRequired * 0.2));

    if (skill.category === 'FRONTEND') await tryAwardBadge(req.user.id, 'Mestre Frontend');
    if (skill.category === 'BACKEND') await tryAwardBadge(req.user.id, 'Backend Hero');

    res.json({ success: true, userSkill, reward: xpResult });
  } catch (e) {
    next(e);
  }
}
