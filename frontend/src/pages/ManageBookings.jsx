import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'CANCELLED', 'FINISHED'];

export default function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ date: '', status: '', courtId: '', userId: '' });
  const [courts, setCourts] = useState([]);

  const load = () => {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([, v]) => v)
    );
    api.get('/bookings', { params })
      .then((res) => setBookings(res.data.bookings))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/courts').then((res) => setCourts(res.data.courts));
    load();
  }, []);

  const handleFilter = (e) => {
    e.preventDefault();
    setLoading(true);
    load();
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success('Status atualizado');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const cancelBooking = async (id) => {
    if (!confirm('Cancelar reserva?')) return;
    try {
      await api.delete(`/bookings/${id}`);
      toast.success('Reserva cancelada');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'client', label: 'Cliente', render: (r) => r.user?.name },
    { key: 'court', label: 'Quadra', render: (r) => r.court?.name },
    { key: 'date', label: 'Data', render: (r) => new Date(r.date).toLocaleDateString('pt-BR') },
    { key: 'time', label: 'Horário', render: (r) => `${r.startTime} – ${r.endTime}` },
    { key: 'total', label: 'Total', render: (r) => `R$ ${r.totalPrice.toFixed(2)}` },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Ações', render: (r) => (
      <div className="flex flex-col gap-1">
        <select
          value={r.status}
          onChange={(e) => updateStatus(r.id, e.target.value)}
          className="rounded border border-sand-200 px-2 py-1 text-xs"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        {r.status !== 'CANCELLED' && (
          <Button size="sm" variant="danger" onClick={() => cancelBooking(r.id)}>
            Cancelar
          </Button>
        )}
      </div>
    )},
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <SidebarAdmin />
        <div className="flex-1">
          <AdminMobileNav />
          <div className="page-container">
            <PageHeader title="Gerenciar reservas" />
            <form onSubmit={handleFilter} className="mb-6 flex flex-wrap gap-3">
              <input
                type="date"
                value={filters.date}
                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                className="rounded-xl border border-sand-200 px-3 py-2 text-sm"
              />
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="rounded-xl border border-sand-200 px-3 py-2 text-sm"
              >
                <option value="">Todos os status</option>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <select
                value={filters.courtId}
                onChange={(e) => setFilters({ ...filters, courtId: e.target.value })}
                className="rounded-xl border border-sand-200 px-3 py-2 text-sm"
              >
                <option value="">Todas as quadras</option>
                {courts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <Button type="submit" size="sm">Filtrar</Button>
            </form>
            {loading ? <Loading /> : <Table columns={columns} data={bookings} />}
          </div>
        </div>
      </div>
    </div>
  );
}
