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

const STATUS_OPTIONS = ['NOT_ISSUED', 'ISSUED', 'CANCELLED'];

export default function ManageInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/invoices/list')
      .then((res) => setInvoices(res.data.invoices))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const issueInvoice = async (bookingId) => {
    try {
      await api.post('/invoices', { bookingId });
      toast.success('Nota fiscal emitida');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/invoices/${id}/status`, { status });
      toast.success('Status atualizado');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'client', label: 'Cliente', render: (r) => r.booking?.user?.name },
    { key: 'court', label: 'Quadra', render: (r) => r.booking?.court?.name },
    { key: 'number', label: 'Número', render: (r) => r.invoiceNumber || '—' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Ações', render: (r) => (
      <div className="flex flex-col gap-1">
        {r.status === 'NOT_ISSUED' && (
          <Button size="sm" onClick={() => issueInvoice(r.bookingId)}>
            Emitir NF
          </Button>
        )}
        <select
          value={r.status}
          onChange={(e) => updateStatus(r.id, e.target.value)}
          className="rounded border border-sand-200 px-2 py-1 text-xs"
        >
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
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
            <PageHeader title="Gerenciar notas fiscais" />
            {loading ? <Loading /> : <Table columns={columns} data={invoices} />}
          </div>
        </div>
      </div>
    </div>
  );
}
