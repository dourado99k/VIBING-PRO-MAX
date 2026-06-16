import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import CourtCard from '../components/CourtCard';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import api from '../services/api';

export default function CourtsList() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/courts')
      .then((res) => setCourts(res.data.courts))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="page-container">
        <PageHeader title="Quadras disponíveis" subtitle="Escolha a quadra ideal para seu jogo" />
        {loading ? (
          <Loading />
        ) : courts.length === 0 ? (
          <EmptyState title="Nenhuma quadra disponível" description="Volte em breve!" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courts.map((court) => (
              <CourtCard key={court.id} court={court} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
