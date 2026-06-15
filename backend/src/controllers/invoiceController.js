import { z } from 'zod';
import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';

const createSchema = z.object({
  bookingId: z.string(),
});

const statusSchema = z.object({
  status: z.enum(['NOT_ISSUED', 'ISSUED', 'CANCELLED']),
  invoiceNumber: z.string().optional(),
});

export async function create(req, res, next) {
  try {
    const { bookingId } = createSchema.parse(req.body);
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { invoice: true, payment: true },
    });
    if (!booking) throw new AppError('Reserva não encontrada', 404);
    if (booking.payment?.status !== 'PAID') {
      throw new AppError('Pagamento deve estar confirmado para emitir nota', 400);
    }

    const invoice = await prisma.invoice.update({
      where: { bookingId },
      data: {
        status: 'ISSUED',
        invoiceNumber: `NF-${Date.now()}`,
        issuedAt: new Date(),
      },
    });
    res.json({ success: true, invoice });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function getByBooking(req, res, next) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.bookingId },
      include: { invoice: true },
    });
    if (!booking) throw new AppError('Reserva não encontrada', 404);
    if (booking.userId !== req.user.id && req.user.role !== 'ADMIN') {
      throw new AppError('Acesso negado', 403);
    }
    res.json({ success: true, invoice: booking.invoice });
  } catch (e) {
    next(e);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const data = statusSchema.parse(req.body);
    const updateData = { status: data.status };
    if (data.status === 'ISSUED') {
      updateData.invoiceNumber = data.invoiceNumber || `NF-${Date.now()}`;
      updateData.issuedAt = new Date();
    }
    const invoice = await prisma.invoice.update({
      where: { id: req.params.id },
      data: updateData,
    });
    res.json({ success: true, invoice });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function listAll(req, res, next) {
  try {
    const invoices = await prisma.invoice.findMany({
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
    res.json({ success: true, invoices });
  } catch (e) {
    next(e);
  }
}
