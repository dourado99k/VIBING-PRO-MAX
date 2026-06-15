import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import api from '../services/api';

const STATUS_OPTIONS = ['PENDING', 'PAID', 'FAILED', 'REFUNDED'];

export default function ManagePayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/payments/list')
      .then((res) => setPayments(res.data.payments))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/payments/${id}/status`, { status });
      toast.success('Status atualizado');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'client', label: 'Cliente', render: (r) => r.booking?.user?.name },
    { key: 'court', label: 'Quadra', render: (r) => r.booking?.court?.name },
    { key: 'amount', label: 'Valor', render: (r) => `R$ ${r.amount.toFixed(2)}` },
    { key: 'method', label: 'Método' },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', label: 'Alterar', render: (r) => (
      <select
        value={r.status}
        onChange={(e) => updateStatus(r.id, e.target.value)}
        className="rounded border border-sand-200 px-2 py-1 text-xs"
      >
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
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
            <PageHeader title="Gerenciar pagamentos" />
            {loading ? <Loading /> : <Table columns={columns} data={payments} />}
          </div>
        </div>
      </div>
    </div>
  );
}
