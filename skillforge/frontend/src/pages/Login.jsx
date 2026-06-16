import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { LogIn, Sword } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Login() {
  const [email, setEmail] = useState('demo@skillforge.com');
  const [password, setPassword] = useState('123456');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Bem-vindo de volta, forjador!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app px-4">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div
        className="glass-card neon-border w-full max-w-md p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-8 text-center">
          <Sword className="icon-accent mx-auto mb-2" size={40} />
          <h1 className="text-2xl font-bold">Entrar na SkillForge</h1>
          <p className="text-sm text-muted">
            Demo aluno: demo@skillforge.com · Admin: admin@skillforge.com · Alpha: aluno@alpha.com
            <br />
            Senha: 123456
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="input-field"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="input-field"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            <LogIn size={18} /> {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-400">
          Não tem conta?{' '}
          <Link to="/register" className="font-medium text-accent hover:underline">
            Cadastre-se
          </Link>
        </p>
        <Link to="/" className="mt-4 block text-center text-sm text-slate-500 hover:text-white">
          ← Voltar ao início
        </Link>
      </motion.div>
    </div>
  );
}
