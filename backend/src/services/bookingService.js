import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import { canClientCancel } from '../utils/timeUtils.js';
import { validateBookingSlot } from './availabilityService.js';

const bookingInclude = {
  user: { select: { id: true, name: true, email: true, phone: true, cpf: true } },
  court: { select: { id: true, name: true, pricePerHour: true } },
  payment: true,
  invoice: true,
};

export async function createBooking(userId, data) {
  const { court, totalPrice, dateOnly } = await validateBookingSlot(data);

  const booking = await prisma.booking.create({
    data: {
      userId,
      courtId: data.courtId,
      date: dateOnly,
      startTime: data.startTime,
      endTime: data.endTime,
      status: 'PENDING',
      totalPrice,
      payment: {
        create: {
          amount: totalPrice,
          method: 'PIX',
          status: 'PENDING',
        },
      },
      invoice: {
        create: {
          status: 'NOT_ISSUED',
        },
      },
    },
    include: bookingInclude,
  });

  return booking;
}

export async function listBookings(filters = {}, user = null) {
  const where = {};

  if (user?.role === 'CLIENTE') {
    where.userId = user.id;
  }

  if (filters.userId) where.userId = filters.userId;
  if (filters.courtId) where.courtId = filters.courtId;
  if (filters.status) where.status = filters.status;
  if (filters.date) {
    const d = new Date(filters.date);
    d.setHours(0, 0, 0, 0);
    where.date = d;
  }

  return prisma.booking.findMany({
    where,
    include: bookingInclude,
    orderBy: [{ date: 'desc' }, { startTime: 'asc' }],
  });
}

export async function getBookingById(id, user = null) {
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: bookingInclude,
  });
  if (!booking) throw new AppError('Reserva não encontrada', 404);

  if (user?.role === 'CLIENTE' && booking.userId !== user.id) {
    throw new AppError('Acesso negado', 403);
  }

  return booking;
}

export async function updateBookingStatus(id, status, user) {
  const booking = await getBookingById(id, user);

  if (user.role === 'CLIENTE') {
    throw new AppError('Acesso negado', 403);
  }

  return prisma.booking.update({
    where: { id },
    data: { status },
    include: bookingInclude,
  });
}

export async function cancelBooking(id, user) {
  const booking = await getBookingById(id, user);

  if (booking.status === 'CANCELLED') {
    throw new AppError('Reserva já cancelada', 400);
  }
  if (booking.status === 'FINISHED') {
    throw new AppError('Não é possível cancelar reserva finalizada', 400);
  }

  if (user.role === 'CLIENTE') {
    if (booking.userId !== user.id) throw new AppError('Acesso negado', 403);
    if (!canClientCancel(booking)) {
      throw new AppError('Cancelamento permitido apenas com 24h de antecedência', 400);
    }
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: 'CANCELLED' },
    include: bookingInclude,
  });

  if (updated.payment?.status === 'PAID') {
    await prisma.payment.update({
      where: { bookingId: id },
      data: { status: 'REFUNDED' },
    });
  }

  return updated;
}

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [
    totalBookings,
    todayBookings,
    pendingBookings,
    pendingPayments,
    revenueBookings,
  ] = await Promise.all([
    prisma.booking.count(),
    prisma.booking.count({
      where: { date: { gte: today, lt: tomorrow }, status: { not: 'CANCELLED' } },
    }),
    prisma.booking.count({ where: { status: 'PENDING' } }),
    prisma.payment.count({ where: { status: 'PENDING' } }),
    prisma.booking.findMany({
      where: { status: { in: ['CONFIRMED', 'FINISHED'] } },
      select: { totalPrice: true },
    }),
  ]);

  const estimatedRevenue = revenueBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  return {
    totalBookings,
    todayBookings,
    estimatedRevenue,
    pendingBookings,
    pendingPayments,
  };
}
