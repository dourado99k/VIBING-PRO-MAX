export const OPEN_HOUR = 8;
export const CLOSE_HOUR = 22;

export function timeToMinutes(time) {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + (m || 0);
}

export function minutesToTime(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function timesOverlap(start1, end1, start2, end2) {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

export function calculateHours(startTime, endTime) {
  const diff = timeToMinutes(endTime) - timeToMinutes(startTime);
  if (diff <= 0) return 0;
  return diff / 60;
}

export function generateTimeSlots() {
  const slots = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    slots.push({
      startTime: minutesToTime(h * 60),
      endTime: minutesToTime((h + 1) * 60),
    });
  }
  return slots;
}

export function parseDateOnly(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isSameDay(d1, d2) {
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}

export function canClientCancel(booking) {
  if (!['PENDING', 'CONFIRMED'].includes(booking.status)) return false;
  const bookingDate = new Date(booking.date);
  const [h, m] = booking.startTime.split(':').map(Number);
  bookingDate.setHours(h, m || 0, 0, 0);
  const now = new Date();
  const hoursUntil = (bookingDate - now) / (1000 * 60 * 60);
  return hoursUntil >= 24;
}
