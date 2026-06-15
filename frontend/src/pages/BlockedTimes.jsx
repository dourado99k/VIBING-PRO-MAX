import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Table from '../components/Table';
import Loading from '../components/Loading';
import api from '../services/api';

export default function BlockedTimes() {
  const [blockedTimes, setBlockedTimes] = useState([]);
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    courtId: '',
    date: '',
    startTime: '08:00',
    endTime: '09:00',
    reason: '',
  });

  const load = () => {
    api.get('/blocked-times')
      .then((res) => setBlockedTimes(res.data.blockedTimes))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    api.get('/courts').then((res) => setCourts(res.data.courts));
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/blocked-times', form);
      toast.success('Horário bloqueado');
      setForm({ ...form, reason: '' });
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Remover bloqueio?')) return;
    try {
      await api.delete(`/blocked-times/${id}`);
      toast.success('Bloqueio removido');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'court', label: 'Quadra', render: (r) => r.court?.name },
    { key: 'date', label: 'Data', render: (r) => new Date(r.date).toLocaleDateString('pt-BR') },
    { key: 'time', label: 'Horário', render: (r) => `${r.startTime} – ${r.endTime}` },
    { key: 'reason', label: 'Motivo', render: (r) => r.reason || '—' },
    { key: 'actions', label: 'Ações', render: (r) => (
      <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Remover</Button>
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
            <PageHeader title="Bloquear horários" subtitle="Indisponibilize horários específicos" />

            <Card className="mb-8">
              <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark">Quadra</label>
                  <select
                    value={form.courtId}
                    onChange={(e) => setForm({ ...form, courtId: e.target.value })}
                    className="w-full rounded-xl border border-sand-200 px-4 py-2.5"
                    required
                  >
                    <option value="">Selecione</option>
                    {courts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <Input label="Data" name="date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                <Input label="Início" name="startTime" type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} required />
                <Input label="Fim" name="endTime" type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} required />
                <Input label="Motivo" name="reason" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} className="sm:col-span-2" />
                <Button type="submit" className="sm:col-span-2">Bloquear horário</Button>
              </form>
            </Card>

            {loading ? <Loading /> : <Table columns={columns} data={blockedTimes} />}
          </div>
        </div>
      </div>
    </div>
  );
}
