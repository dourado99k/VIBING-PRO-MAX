import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import Loading from '../components/Loading';
import api from '../services/api';

export default function ManageCourts() {
  const [courts, setCourts] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/courts').then((res) => setCourts(res.data.courts)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta quadra?')) return;
    try {
      await api.delete(`/courts/${id}`);
      toast.success('Quadra excluída');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'price', label: 'Preço/h', render: (r) => `R$ ${r.pricePerHour.toFixed(2)}` },
    { key: 'status', label: 'Status', render: (r) => (
      <StatusBadge status={r.isActive ? 'CONFIRMED' : 'CANCELLED'} />
    )},
    { key: 'actions', label: 'Ações', render: (r) => (
      <div className="flex gap-2">
        <Link to={`/admin/quadras/${r.id}`}>
          <Button size="sm" variant="ghost"><Pencil size={14} /></Button>
        </Link>
        <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>
          <Trash2 size={14} />
        </Button>
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
            <PageHeader
              title="Gerenciar quadras"
              action={
                <Link to="/admin/quadras/nova">
                  <Button><Plus size={16} /> Nova quadra</Button>
                </Link>
              }
            />
            {loading ? <Loading /> : <Table columns={columns} data={courts} />}
          </div>
        </div>
      </div>
    </div>
  );
}
