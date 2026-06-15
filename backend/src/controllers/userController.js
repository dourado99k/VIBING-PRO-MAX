import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { userPublicSelect } from '../utils/userSelect.js';

const updateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  cep: z.string().min(8).optional(),
  birthDate: z.string().optional(),
});

export async function list(req, res, next) {
  try {
    const users = await prisma.user.findMany({
      where: { role: 'CLIENTE' },
      select: userPublicSelect,
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, users });
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const isAdmin = req.user.role === 'ADMIN';
    const isSelf = req.user.id === req.params.id;
    if (!isAdmin && !isSelf) throw new AppError('Acesso negado', 403);

    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...userPublicSelect,
        bookings: {
          include: {
            court: { select: { id: true, name: true } },
            payment: true,
            invoice: true,
          },
          orderBy: { date: 'desc' },
        },
      },
    });
    if (!user) throw new AppError('Usuário não encontrado', 404);
    res.json({ success: true, user });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = updateSchema.parse(req.body);
    const isAdmin = req.user.role === 'ADMIN';
    const isSelf = req.user.id === req.params.id;

    if (!isAdmin && !isSelf) throw new AppError('Acesso negado', 403);

    const updateData = { ...data };
    if (data.birthDate) updateData.birthDate = new Date(data.birthDate);

    const user = await prisma.user.update({
      where: { id: req.params.id },
      data: updateData,
      select: userPublicSelect,
    });
    res.json({ success: true, user });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Usuário removido' });
  } catch (e) {
    next(e);
  }
}
