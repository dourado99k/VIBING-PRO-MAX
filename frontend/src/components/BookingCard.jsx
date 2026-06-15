import { Calendar, Clock, MapPin, CreditCard } from 'lucide-react';
import Card from './Card';
import StatusBadge from './StatusBadge';
import Button from './Button';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-BR');
}

export default function BookingCard({ booking, onCancel, onPay, showActions = true }) {
  return (
    <Card>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-bold text-dark">{booking.court?.name}</h3>
            <StatusBadge status={booking.status} />
          </div>
          <p className="flex items-center gap-2 text-sm text-muted">
            <Calendar size={16} /> {formatDate(booking.date)}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted">
            <Clock size={16} /> {booking.startTime} – {booking.endTime}
          </p>
          <p className="flex items-center gap-2 text-sm text-muted">
            <MapPin size={16} /> {booking.court?.name}
          </p>
          <p className="text-sm font-semibold text-primary-600">
            Total: R$ {booking.totalPrice.toFixed(2)}
          </p>
          {booking.payment && (
            <p className="flex items-center gap-2 text-sm">
              <CreditCard size={16} className="text-muted" />
              Pagamento: <StatusBadge status={booking.payment.status} />
            </p>
          )}
          {booking.invoice && (
            <p className="text-sm">
              Nota fiscal: <StatusBadge status={booking.invoice.status} />
              {booking.invoice.invoiceNumber && (
                <span className="ml-2 text-muted">#{booking.invoice.invoiceNumber}</span>
              )}
            </p>
          )}
        </div>
        {showActions && (
          <div className="flex flex-col gap-2 sm:items-end">
            {booking.payment?.status === 'PENDING' && booking.status !== 'CANCELLED' && onPay && (
              <Button size="sm" onClick={() => onPay(booking)}>
                Pagar
              </Button>
            )}
            {['PENDING', 'CONFIRMED'].includes(booking.status) && onCancel && (
              <Button size="sm" variant="danger" onClick={() => onCancel(booking)}>
                Cancelar
              </Button>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
