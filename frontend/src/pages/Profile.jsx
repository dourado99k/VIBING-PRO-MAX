import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Navbar from '../components/Navbar';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

export default function Profile() {
  const { user, checkAuth } = useAuthStore();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        phone: user.phone,
        cep: user.cep,
        birthDate: user.birthDate?.split('T')[0] || '',
      });
      setLoading(false);
    }
  }, [user]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/users/${user.id}`, form);
      await checkAuth();
      toast.success('Perfil atualizado!');
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
      <div className="page-container max-w-lg">
        <PageHeader title="Meu perfil" subtitle="Atualize seus dados pessoais" />
        <Card>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Nome" name="name" value={form.name} onChange={handleChange} required />
            <Input label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required />
            <Input label="Telefone" name="phone" value={form.phone} onChange={handleChange} />
            <Input label="CEP" name="cep" value={form.cep} onChange={handleChange} />
            <Input label="Data de nascimento" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
            <p className="text-sm text-muted">CPF: {user.cpf}</p>
            <Button type="submit" loading={saving}>Salvar alterações</Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
