import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const courtSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  pricePerHour: z.number().positive(),
  isActive: z.boolean().optional(),
});

export async function list(req, res, next) {
  try {
    const where = req.user.role === 'ADMIN' ? {} : { isActive: true };
    const courts = await prisma.court.findMany({
      where,
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, courts });
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const court = await prisma.court.findUnique({
      where: { id: req.params.id },
      include: { _count: { select: { bookings: true } } },
    });
    if (!court) throw new AppError('Quadra não encontrada', 404);
    if (!court.isActive && req.user.role !== 'ADMIN') {
      throw new AppError('Quadra indisponível', 404);
    }
    res.json({ success: true, court });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = courtSchema.parse(req.body);
    const court = await prisma.court.create({ data });
    res.status(201).json({ success: true, court });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function update(req, res, next) {
  try {
    const data = courtSchema.partial().parse(req.body);
    const court = await prisma.court.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, court });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.court.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Quadra removida' });
  } catch (e) {
    next(e);
  }
}
