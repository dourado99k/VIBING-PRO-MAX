import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

export default function CourtForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = id === 'nova';
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    pricePerHour: '',
    isActive: true,
  });

  useEffect(() => {
    if (!isNew) {
      api.get(`/courts/${id}`)
        .then((res) => {
          const c = res.data.court;
          setForm({
            name: c.name,
            description: c.description || '',
            pricePerHour: c.pricePerHour,
            isActive: c.isActive,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, pricePerHour: parseFloat(form.pricePerHour) };
    try {
      if (isNew) {
        await api.post('/courts', payload);
        toast.success('Quadra criada!');
      } else {
        await api.put(`/courts/${id}`, payload);
        toast.success('Quadra atualizada!');
      }
      navigate('/admin/quadras');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <><Navbar /><Loading /></>;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <SidebarAdmin />
        <div className="flex-1">
          <AdminMobileNav />
          <div className="page-container max-w-lg">
            <PageHeader title={isNew ? 'Nova quadra' : 'Editar quadra'} />
            <Card>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Nome" name="name" value={form.name} onChange={handleChange} required />
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-dark">Descrição</label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full rounded-xl border border-sand-200 px-4 py-2.5"
                  />
                </div>
                <Input
                  label="Preço por hora (R$)"
                  name="pricePerHour"
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.pricePerHour}
                  onChange={handleChange}
                  required
                />
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" name="isActive" checked={form.isActive} onChange={handleChange} />
                  Quadra ativa
                </label>
                <div className="flex gap-3">
                  <Button type="submit" loading={saving}>Salvar</Button>
                  <Button variant="ghost" type="button" onClick={() => navigate('/admin/quadras')}>
                    Cancelar
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
