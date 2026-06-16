import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { UserPlus, Sword, Building2, Users } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import ThemeToggle from '../components/ui/ThemeToggle';

export default function Register() {
  const [params] = useSearchParams();
  const initialType = params.get('tipo') === 'empresa' ? 'ORG_ADMIN' : 'USER';
  const [accountType, setAccountType] = useState(initialType);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [organizationSlug, setOrganizationSlug] = useState('');
  const [industry, setIndustry] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({
        name,
        email,
        password,
        accountType,
        organizationName: accountType === 'ORG_ADMIN' ? organizationName : undefined,
        organizationSlug,
        industry: accountType === 'ORG_ADMIN' ? industry : undefined,
      });
      toast.success(
        accountType === 'ORG_ADMIN'
          ? 'Organização criada! Configure seus conteúdos.'
          : 'Conta criada! Bem-vindo à trilha.'
      );
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-app px-4 py-12">
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>
      <motion.div
        className="glass-card neon-border w-full max-w-lg p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="mb-6 text-center">
          <Sword className="icon-accent mx-auto mb-2" size={40} />
          <h1 className="text-2xl font-bold">Criar conta</h1>
          <p className="text-sm text-muted">Plataforma B2B SkillForge</p>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setAccountType('ORG_ADMIN')}
            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${
              accountType === 'ORG_ADMIN'
                ? 'border-accent bg-accent-bg text-accent'
                : 'border-app text-muted'
            }`}
          >
            <Building2 size={18} /> Empresa / Admin
          </button>
          <button
            type="button"
            onClick={() => setAccountType('USER')}
            className={`flex items-center justify-center gap-2 rounded-xl border py-3 text-sm font-medium transition ${
              accountType === 'USER'
                ? 'border-accent bg-accent-bg text-accent'
                : 'border-app text-muted'
            }`}
          >
            <Users size={18} /> Aluno / Usuário
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="input-field" placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} required />
          <input type="email" className="input-field" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <input type="password" className="input-field" placeholder="Senha (min. 6)" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />

          {accountType === 'ORG_ADMIN' ? (
            <>
              <input className="input-field" placeholder="Nome da organização (ex: Alpha Pré-Vestibular)" value={organizationName} onChange={(e) => setOrganizationName(e.target.value)} required />
              <input className="input-field" placeholder="Código da turma (slug, ex: alpha-prevest)" value={organizationSlug} onChange={(e) => setOrganizationSlug(e.target.value)} />
              <input className="input-field" placeholder="Segmento (ex: Pré-vestibular)" value={industry} onChange={(e) => setIndustry(e.target.value)} />
            </>
          ) : (
            <input
              className="input-field"
              placeholder="Código da organização (ex: alpha-prevest)"
              value={organizationSlug}
              onChange={(e) => setOrganizationSlug(e.target.value)}
              required
            />
          )}

          <button type="submit" className="btn-primary w-full" disabled={isLoading}>
            <UserPlus size={18} /> {isLoading ? 'Criando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted">
          Já tem conta? <Link to="/login" className="font-medium text-accent hover:underline">Entrar</Link>
        </p>
      </motion.div>
    </div>
  );
}
