import prisma from '../config/db.js';
import { AppError } from '../utils/AppError.js';
import {
  calculateHours,
  generateTimeSlots,
  parseDateOnly,
  timesOverlap,
} from '../utils/timeUtils.js';

export async function getAvailability(courtId, dateStr) {
  const court = await prisma.court.findUnique({ where: { id: courtId } });
  if (!court) throw new AppError('Quadra não encontrada', 404);
  if (!court.isActive) throw new AppError('Quadra indisponível', 400);

  const date = parseDateOnly(dateStr);

  const [bookings, blockedTimes] = await Promise.all([
    prisma.booking.findMany({
      where: {
        courtId,
        date,
        status: { in: ['PENDING', 'CONFIRMED', 'FINISHED'] },
      },
    }),
    prisma.blockedTime.findMany({ where: { courtId, date } }),
  ]);

  const allSlots = generateTimeSlots();

  const availableSlots = allSlots.filter((slot) => {
    const blockedByBooking = bookings.some((b) =>
      timesOverlap(slot.startTime, slot.endTime, b.startTime, b.endTime)
    );
    const blockedByAdmin = blockedTimes.some((b) =>
      timesOverlap(slot.startTime, slot.endTime, b.startTime, b.endTime)
    );
    return !blockedByBooking && !blockedByAdmin;
  });

  return {
    court: {
      id: court.id,
      name: court.name,
      pricePerHour: court.pricePerHour,
    },
    date: dateStr,
    slots: availableSlots.map((s) => ({
      ...s,
      price: court.pricePerHour,
    })),
  };
}

export async function validateBookingSlot({ courtId, date, startTime, endTime }) {
  const court = await prisma.court.findUnique({ where: { id: courtId } });
  if (!court) throw new AppError('Quadra não encontrada', 404);
  if (!court.isActive) throw new AppError('Quadra indisponível', 400);

  const hours = calculateHours(startTime, endTime);
  if (hours <= 0) throw new AppError('Horário inválido', 400);

  const dateOnly = parseDateOnly(date);

  const [bookings, blockedTimes] = await Promise.all([
    prisma.booking.findMany({
      where: {
        courtId,
        date: dateOnly,
        status: { in: ['PENDING', 'CONFIRMED', 'FINISHED'] },
      },
    }),
    prisma.blockedTime.findMany({ where: { courtId, date: dateOnly } }),
  ]);

  const hasBookingConflict = bookings.some((b) =>
    timesOverlap(startTime, endTime, b.startTime, b.endTime)
  );
  if (hasBookingConflict) throw new AppError('Horário já reservado', 409);

  const hasBlockConflict = blockedTimes.some((b) =>
    timesOverlap(startTime, endTime, b.startTime, b.endTime)
  );
  if (hasBlockConflict) throw new AppError('Horário bloqueado pelo administrador', 409);

  const totalPrice = hours * court.pricePerHour;

  return { court, totalPrice, dateOnly };
}
