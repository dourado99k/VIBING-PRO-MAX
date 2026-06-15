import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { parseDateOnly } from '../utils/timeUtils.js';

const createSchema = z.object({
  courtId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  reason: z.string().optional(),
});

export async function list(req, res, next) {
  try {
    const where = {};
    if (req.query.courtId) where.courtId = req.query.courtId;
    if (req.query.date) where.date = parseDateOnly(req.query.date);

    const blockedTimes = await prisma.blockedTime.findMany({
      where,
      include: { court: { select: { id: true, name: true } } },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
    res.json({ success: true, blockedTimes });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const blockedTime = await prisma.blockedTime.create({
      data: {
        courtId: data.courtId,
        date: parseDateOnly(data.date),
        startTime: data.startTime,
        endTime: data.endTime,
        reason: data.reason,
      },
      include: { court: { select: { id: true, name: true } } },
    });
    res.status(201).json({ success: true, blockedTime });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.blockedTime.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Bloqueio removido' });
  } catch (e) {
    next(e);
  }
}
