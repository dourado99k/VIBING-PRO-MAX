import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

export default function BookingPage() {
  const { courtId } = useParams();
  const navigate = useNavigate();
  const [court, setCourt] = useState(null);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    api.get(`/courts/${courtId}`)
      .then((res) => setCourt(res.data.court))
      .finally(() => setLoading(false));
  }, [courtId]);

  useEffect(() => {
    if (!date) return;
    api.get('/availability', { params: { courtId, date } })
      .then((res) => setSlots(res.data.slots))
      .catch((err) => toast.error(err.message));
  }, [courtId, date]);

  const handleBook = async () => {
    if (!selected) return;
    setBooking(true);
    try {
      const { data } = await api.post('/bookings', {
        courtId,
        date,
        startTime: selected.startTime,
        endTime: selected.endTime,
      });
      toast.success('Reserva criada! Prossiga para o pagamento.');
      navigate(`/pagamento/${data.booking.id}`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const minDate = new Date().toISOString().split('T')[0];

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container max-w-2xl">
        <PageHeader title={`Reservar: ${court?.name}`} subtitle="Escolha a data e o horário" />

        <Card className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-dark">Data</label>
            <input
              type="date"
              min={minDate}
              value={date}
              onChange={(e) => { setDate(e.target.value); setSelected(null); }}
              className="w-full rounded-xl border border-sand-200 px-4 py-2.5"
            />
          </div>

          {date && (
            <div>
              <p className="mb-3 text-sm font-medium text-dark">Horários disponíveis</p>
              {slots.length === 0 ? (
                <p className="text-sm text-muted">Nenhum horário disponível nesta data.</p>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.map((slot) => (
                    <button
                      key={slot.startTime}
                      onClick={() => setSelected(slot)}
                      className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                        selected?.startTime === slot.startTime
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : 'border-sand-200 hover:border-primary-300'
                      }`}
                    >
                      {slot.startTime} – {slot.endTime}
                      <span className="block text-xs text-muted">R$ {slot.price.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {selected && (
            <div className="rounded-xl bg-sand-50 p-4">
              <p className="font-semibold text-dark">Resumo</p>
              <p className="text-sm text-muted">
                {date} · {selected.startTime} – {selected.endTime}
              </p>
              <p className="mt-1 font-bold text-primary-600">
                Total: R$ {selected.price.toFixed(2)}
              </p>
            </div>
          )}

          <Button
            className="w-full"
            disabled={!selected}
            loading={booking}
            onClick={handleBook}
          >
            Confirmar reserva
          </Button>
        </Card>
      </div>
    </div>
  );
}
