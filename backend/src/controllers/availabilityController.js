import { AppError } from '../utils/AppError.js';
import { getAvailability } from '../services/availabilityService.js';

export async function getSlots(req, res, next) {
  try {
    const { courtId, date } = req.query;
    if (!courtId || !date) throw new AppError('courtId e date são obrigatórios', 400);
    const availability = await getAvailability(courtId, date);
    res.json({ success: true, ...availability });
  } catch (e) {
    next(e);
  }
}
