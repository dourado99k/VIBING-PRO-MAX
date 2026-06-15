import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Table from '../components/Table';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

export default function ManageClients() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api.get('/users')
      .then((res) => setUsers(res.data.users))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Excluir este cliente?')) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success('Cliente removido');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const columns = [
    { key: 'name', label: 'Nome' },
    { key: 'email', label: 'E-mail' },
    { key: 'cpf', label: 'CPF' },
    { key: 'phone', label: 'Telefone' },
    { key: 'actions', label: 'Ações', render: (r) => (
      <Button size="sm" variant="danger" onClick={() => handleDelete(r.id)}>Excluir</Button>
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
            <PageHeader title="Gerenciar clientes" />
            {loading ? <Loading /> : <Table columns={columns} data={users} />}
          </div>
        </div>
      </div>
    </div>
  );
}
