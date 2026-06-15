import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

export default function DashboardCliente() {
  const [courts, setCourts] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get('/courts'),
      api.get('/bookings/my'),
    ])
      .then(([courtsRes, bookingsRes]) => {
        setCourts(courtsRes.data.courts.slice(0, 3));
        setBookings(bookingsRes.data.bookings.slice(0, 3));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <><Navbar /><Loading /></>;

  const upcoming = bookings.filter((b) => b.status !== 'CANCELLED');

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">
        <PageHeader
          title="Olá! Pronto para jogar?"
          subtitle="Reserve sua quadra de areia em poucos passos"
          action={
            <Link to="/quadras">
              <Button>Ver quadras</Button>
            </Link>
          }
        />

        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="flex items-center gap-4">
            <div className="rounded-xl bg-primary-50 p-3">
              <MapPin className="text-primary-600" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{courts.length}+</p>
              <p className="text-sm text-muted">Quadras disponíveis</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4">
            <div className="rounded-xl bg-success-light p-3">
              <Calendar className="text-success-dark" size={24} />
            </div>
            <div>
              <p className="text-2xl font-bold text-dark">{upcoming.length}</p>
              <p className="text-sm text-muted">Suas reservas</p>
            </div>
          </Card>
        </div>

        <h2 className="mb-4 text-lg font-bold text-dark">Próximas reservas</h2>
        {upcoming.length === 0 ? (
          <Card>
            <p className="text-muted">Você ainda não tem reservas.</p>
            <Link to="/quadras" className="mt-3 inline-block">
              <Button size="sm">Reservar agora</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((b) => (
              <Card key={b.id} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-dark">{b.court?.name}</p>
                  <p className="text-sm text-muted">
                    {new Date(b.date).toLocaleDateString('pt-BR')} · {b.startTime}
                  </p>
                </div>
                <Link to="/minhas-reservas">
                  <Button variant="ghost" size="sm">Ver</Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
