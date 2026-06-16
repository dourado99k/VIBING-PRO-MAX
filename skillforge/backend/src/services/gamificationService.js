import prisma from '../config/db.js';
import { calculateLevel, getLevelTitle, xpProgressInLevel } from '../utils/levelSystem.js';

export async function addXpToUser(userId, amount) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return null;

  const oldLevel = user.level;
  const newXp = user.xp + amount;
  const newLevel = calculateLevel(newXp);
  const leveledUp = newLevel > oldLevel;

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { xp: newXp, level: newLevel },
  });

  await updateRanking(userId, user.organizationId);

  return {
    user: updated,
    xpGained: amount,
    leveledUp,
    oldLevel,
    newLevel,
    levelTitle: getLevelTitle(newLevel),
    progress: xpProgressInLevel(newXp, newLevel),
  };
}

export async function updateRanking(userId, organizationId) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const orgId = organizationId || user?.organizationId;
  if (!orgId) return;

  const users = await prisma.user.findMany({
    where: { organizationId: orgId, role: 'USER' },
    orderBy: [{ xp: 'desc' }, { level: 'desc' }],
    select: { id: true },
  });

  for (let i = 0; i < users.length; i++) {
    await prisma.ranking.upsert({
      where: { userId: users[i].id },
      create: { userId: users[i].id, position: i + 1 },
      update: { position: i + 1 },
    });
  }
}

export async function updateStreak(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let streak = await prisma.streak.findUnique({ where: { userId } });
  if (!streak) {
    streak = await prisma.streak.create({
      data: { userId, currentStreak: 1, longestStreak: 1, lastStudyDate: today },
    });
    return streak;
  }

  const last = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
  if (last) last.setHours(0, 0, 0, 0);

  const diffDays = last ? Math.floor((today - last) / (1000 * 60 * 60 * 24)) : 999;

  let currentStreak = streak.currentStreak;
  if (diffDays === 0) return streak;
  if (diffDays === 1) currentStreak += 1;
  else currentStreak = 1;

  const longestStreak = Math.max(streak.longestStreak, currentStreak);

  return prisma.streak.update({
    where: { userId },
    data: { currentStreak, longestStreak, lastStudyDate: today },
  });
}

export async function tryAwardBadge(userId, badgeName) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user?.organizationId) return null;
  const badge = await prisma.badge.findFirst({
    where: { organizationId: user.organizationId, name: badgeName },
  });
  if (!badge) return null;

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return null;

  await prisma.userBadge.create({
    data: { userId, badgeId: badge.id },
  });

  if (badge.xpBonus > 0) {
    await addXpToUser(userId, badge.xpBonus);
  }

  return badge;
}

export function getLearningProgress(user, skills, stats = {}) {
  const unlocked = skills.filter((s) => s.unlocked).length;
  const totalSkills = skills.length || 1;
  const orgName = user.organization?.name || 'sua organização';
  const missionsDone = stats.missionsCompleted || 0;
  const contentsRead = stats.contentsEngaged || 0;

  const overallPercent = Math.round(
    ((unlocked / totalSkills) * 50 + Math.min(missionsDone * 10, 50)) 
  );

  const missing = skills.filter((s) => !s.unlocked).map((s) => s.skill?.name || s.name);

  return {
    overallPercent: Math.min(100, overallPercent || 15),
    tracks: [
      {
        career: 'Trilha de conteúdos',
        percent: Math.min(100, (contentsRead / Math.max(stats.totalContents || 1, 1)) * 100),
        missingSkills: [],
      },
      {
        career: 'Habilidades gamificadas',
        percent: Math.round((unlocked / totalSkills) * 100),
        missingSkills: missing.slice(0, 5),
      },
    ],
    primaryMessage: `Você está ${Math.min(100, overallPercent)}% engajado na trilha de ${orgName}.`,
  };
}
