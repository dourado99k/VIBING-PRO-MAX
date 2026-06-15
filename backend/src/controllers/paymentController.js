import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const paymentSchema = z.object({
  bookingId: z.string(),
  method: z.enum(['PIX', 'CARD', 'CASH']),
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
});

export async function createPayment(req, res, next) {
  try {
    const { bookingId, method } = paymentSchema.parse(req.body);

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { payment: true },
    });
    if (!booking) throw new AppError('Reserva não encontrada', 404);
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Acesso negado', 403);
    }
    if (booking.status === 'CANCELLED') {
      throw new AppError('Reserva cancelada', 400);
    }

    const payment = await prisma.payment.update({
      where: { bookingId },
      data: {
        method,
        status: 'PAID',
        paidAt: new Date(),
      },
    });

    if (booking.status === 'PENDING') {
      await prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({ success: true, payment, message: 'Pagamento simulado com sucesso' });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function getByBooking(req, res, next) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.bookingId },
      include: { payment: true },
    });
    if (!booking) throw new AppError('Reserva não encontrada', 404);
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Acesso negado', 403);
    }
    res.json({ success: true, payment: booking.payment });
  } catch (e) {
    next(e);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = statusSchema.parse(req.body);
    const payment = await prisma.payment.update({
      where: { id: req.params.id },
      data: {
        status,
        paidAt: status === 'PAID' ? new Date() : null,
      },
    });

    if (status === 'PAID') {
      await prisma.booking.update({
        where: { id: payment.bookingId },
        data: { status: 'CONFIRMED' },
      });
    }

    res.json({ success: true, payment });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function listAll(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      include: {
        booking: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            court: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, payments });
  } catch (e) {
    next(e);
  }
}
