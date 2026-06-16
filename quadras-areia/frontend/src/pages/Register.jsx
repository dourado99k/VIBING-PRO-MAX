import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserPlus } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function Register() {
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    cpf: '',
    phone: '',
    cep: '',
    birthDate: '',
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success('Cadastro realizado com sucesso!');
      navigate('/cliente');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-10">
        <Card className="w-full max-w-lg">
          <div className="mb-6 text-center">
            <UserPlus className="mx-auto mb-2 text-primary-600" size={40} />
            <h1 className="text-2xl font-bold text-dark">Criar conta</h1>
          </div>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input label="Nome completo" name="name" value={form.name} onChange={handleChange} required className="sm:col-span-2" />
            <Input label="E-mail" name="email" type="email" value={form.email} onChange={handleChange} required className="sm:col-span-2" />
            <Input label="Senha" name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} className="sm:col-span-2" />
            <Input label="CPF" name="cpf" value={form.cpf} onChange={handleChange} required />
            <Input label="Telefone" name="phone" value={form.phone} onChange={handleChange} required />
            <Input label="CEP" name="cep" value={form.cep} onChange={handleChange} required />
            <Input label="Data de nascimento" name="birthDate" type="date" value={form.birthDate} onChange={handleChange} required />
            <div className="sm:col-span-2">
              <Button type="submit" className="w-full" loading={isLoading}>
                Cadastrar
              </Button>
            </div>
          </form>
          <p className="mt-4 text-center text-sm text-muted">
            Já tem conta?{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:underline">
              Entrar
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
