import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import BookingCard from '../components/BookingCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const load = () => {
    api.get('/bookings/my')
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCancel = async (booking) => {
    if (!confirm('Deseja cancelar esta reserva?')) return;
    try {
      await api.delete(`/bookings/${booking.id}`);
      toast.success('Reserva cancelada');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handlePay = (booking) => navigate(`/pagamento/${booking.id}`);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">
        <PageHeader title="Minhas reservas" subtitle="Acompanhe e gerencie suas reservas" />
        {loading ? (
          <Loading />
        ) : bookings.length === 0 ? (
          <EmptyState title="Nenhuma reserva" description="Reserve uma quadra para começar!" />
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard
                key={b.id}
                booking={b}
                onCancel={handleCancel}
                onPay={handlePay}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
