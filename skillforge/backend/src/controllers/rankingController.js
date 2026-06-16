import prisma from '../config/db.js';
import { getOrgId } from '../middleware/auth.js';

export async function leaderboard(req, res, next) {
  try {
    const orgId = req.user ? getOrgId(req.user) : req.query.organizationId;
    const where = orgId
      ? { organizationId: orgId, role: 'USER' }
      : { role: 'USER' };

    const users = await prisma.user.findMany({
      where,
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
      take: 50,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        streak: { select: { currentStreak: true, longestStreak: true } },
        ranking: { select: { position: true } },
      },
    });

    const leaderboard = users.map((u, i) => ({
      position: u.ranking?.position || i + 1,
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      level: u.level,
      xp: u.xp,
      streak: u.streak?.currentStreak || 0,
    }));

    res.json({ success: true, leaderboard });
  } catch (e) {
    next(e);
  }
}

export async function updateRankings(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      orderBy: [{ xp: 'desc' }, { level: 'desc' }],
    });
    for (let i = 0; i < users.length; i++) {
      await prisma.ranking.upsert({
        where: { userId: users[i].id },
        create: { userId: users[i].id, position: i + 1 },
        update: { position: i + 1 },
      });
    }
    res.json({ success: true, message: 'Rankings atualizados' });
  } catch (e) {
    next(e);
  }
}
