import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogIn } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      toast.success('Login realizado com sucesso!');
      navigate(data.user.role === 'ADMIN' ? '/admin' : '/cliente');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-sand-50">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md">
          <div className="mb-6 text-center">
            <LogIn className="mx-auto mb-2 text-primary-600" size={40} />
            <h1 className="text-2xl font-bold text-dark">Entrar</h1>
            <p className="mt-1 text-sm text-muted">
              Admin: admin@quadras.com / admin123
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full" loading={isLoading}>
              Entrar
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-muted">
            Não tem conta?{' '}
            <Link to="/cadastro" className="font-medium text-primary-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
