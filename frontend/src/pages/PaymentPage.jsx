import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CreditCard, QrCode, Banknote } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import api from '../services/api';

const methods = [
  { id: 'PIX', label: 'PIX', icon: QrCode },
  { id: 'CARD', label: 'Cartão', icon: CreditCard },
  { id: 'CASH', label: 'Dinheiro', icon: Banknote },
];

export default function PaymentPage() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [method, setMethod] = useState('PIX');
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    api.get(`/bookings/${bookingId}`)
      .then((res) => setBooking(res.data.booking))
      .finally(() => setLoading(false));
  }, [bookingId]);

  const handlePay = async () => {
    setPaying(true);
    try {
      await api.post('/payments', { bookingId, method });
      toast.success('Pagamento simulado com sucesso!');
      const { data } = await api.get(`/bookings/${bookingId}`);
      setBooking(data.booking);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setPaying(false);
    }
  };

  if (loading) return <><Navbar /><Loading /></>;
  if (!booking) return <><Navbar /><p className="page-container">Reserva não encontrada</p></>;

  const paid = booking.payment?.status === 'PAID';

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container max-w-lg">
        <Card>
          <h1 className="text-2xl font-bold text-dark">Pagamento</h1>
          <div className="mt-4 space-y-2 text-sm text-muted">
            <p><strong className="text-dark">Quadra:</strong> {booking.court?.name}</p>
            <p><strong className="text-dark">Data:</strong> {new Date(booking.date).toLocaleDateString('pt-BR')}</p>
            <p><strong className="text-dark">Horário:</strong> {booking.startTime} – {booking.endTime}</p>
            <p className="text-lg font-bold text-primary-600">
              Total: R$ {booking.totalPrice.toFixed(2)}
            </p>
            <p>Status: <StatusBadge status={booking.payment?.status} /></p>
          </div>

          {!paid ? (
            <>
              <p className="mt-6 mb-3 font-medium text-dark">Forma de pagamento</p>
              <div className="grid grid-cols-3 gap-2">
                {methods.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setMethod(id)}
                    className={`flex flex-col items-center gap-1 rounded-xl border p-3 text-sm ${
                      method === id ? 'border-primary-600 bg-primary-50' : 'border-sand-200'
                    }`}
                  >
                    <Icon size={20} />
                    {label}
                  </button>
                ))}
              </div>
              <Button className="mt-6 w-full" loading={paying} onClick={handlePay}>
                Simular pagamento
              </Button>
            </>
          ) : (
            <div className="mt-6 rounded-xl bg-success-light p-4 text-center">
              <p className="font-semibold text-success-dark">Pagamento confirmado!</p>
              <p className="mt-1 text-sm text-muted">
                Pago em {new Date(booking.payment.paidAt).toLocaleString('pt-BR')} via {booking.payment.method}
              </p>
            </div>
          )}

          <Link to="/minhas-reservas" className="mt-4 block text-center text-sm text-primary-600 hover:underline">
            Voltar às minhas reservas
          </Link>
        </Card>
      </div>
    </div>
  );
}
