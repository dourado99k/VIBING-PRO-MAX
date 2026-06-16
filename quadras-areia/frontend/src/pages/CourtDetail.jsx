import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

export default function CourtDetail() {
  const { id } = useParams();
  const [court, setCourt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/courts/${id}`)
      .then((res) => setCourt(res.data.court))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <><Navbar /><Loading /></>;
  if (!court) return <><Navbar /><p className="page-container">Quadra não encontrada</p></>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">
        <Card>
          <div className="mb-6 flex h-48 items-center justify-center rounded-xl bg-gradient-to-br from-primary-100 to-sand-200">
            <MapPin className="text-primary-600" size={64} />
          </div>
          <h1 className="text-3xl font-bold text-dark">{court.name}</h1>
          <p className="mt-3 text-muted">{court.description}</p>
          <p className="mt-4 flex items-center gap-2 text-lg font-semibold text-primary-600">
            <Clock size={20} />
            R$ {court.pricePerHour.toFixed(2)} por hora
          </p>
          <Link to={`/reservar/${court.id}`} className="mt-6 inline-block">
            <Button size="lg">Reservar horário</Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
