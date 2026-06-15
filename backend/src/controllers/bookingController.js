import { z } from 'zod';
import * as bookingService from '../services/bookingService.js';
import { AppError } from '../utils/AppError.js';

const createSchema = z.object({
  courtId: z.string(),
  date: z.string(),
  startTime: z.string(),
  endTime: z.string(),
});

const statusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED']),
});

export async function list(req, res, next) {
  try {
    const filters = {
      userId: req.query.userId,
      courtId: req.query.courtId,
      status: req.query.status,
      date: req.query.date,
    };
    const bookings = await bookingService.listBookings(filters, req.user);
    res.json({ success: true, bookings });
  } catch (e) {
    next(e);
  }
}

export async function myBookings(req, res, next) {
  try {
    const bookings = await bookingService.listBookings({}, req.user);
    res.json({ success: true, bookings });
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const booking = await bookingService.getBookingById(req.params.id, req.user);
    res.json({ success: true, booking });
  } catch (e) {
    next(e);
  }
}

export async function create(req, res, next) {
  try {
    const data = createSchema.parse(req.body);
    const booking = await bookingService.createBooking(req.user.id, data);
    res.status(201).json({ success: true, booking });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = statusSchema.parse(req.body);
    const booking = await bookingService.updateBookingStatus(
      req.params.id,
      status,
      req.user
    );
    res.json({ success: true, booking });
  } catch (e) {
    next(e instanceof z.ZodError ? new AppError(e.errors[0].message) : e);
  }
}

export async function remove(req, res, next) {
  try {
    const booking = await bookingService.cancelBooking(req.params.id, req.user);
    res.json({ success: true, booking });
  } catch (e) {
    next(e);
  }
}

export async function dashboard(req, res, next) {
  try {
    const stats = await bookingService.getDashboardStats();
    res.json({ success: true, stats });
  } catch (e) {
    next(e);
  }
}
