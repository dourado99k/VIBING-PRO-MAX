import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Sword, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import ThemeToggle from '../ui/ThemeToggle';

export default function Navbar({ variant = 'landing' }) {
  const [open, setOpen] = useState(false);
  const { logout, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const authed = isAuthenticated();

  const links =
    variant === 'landing'
      ? [
          { to: '#beneficios', label: 'Benefícios' },
          { to: '#gamificacao', label: 'Gamificação' },
          { to: '/ranking', label: 'Ranking' },
          { to: '/planos', label: 'Planos' },
        ]
      : [];

  return (
    <nav className="fixed top-0 z-40 w-full border-b border-app bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <Sword className="icon-accent" size={28} />
          <span className="brand-logo">
            Skill<span>Forge</span>
          </span>
        </Link>

        <div className="hidden items-center gap-4 md:flex">
          <ThemeToggle />
          {links.map((l) => (
            <a key={l.to} href={l.to} className="link-nav text-sm font-medium">
              {l.label}
            </a>
          ))}
          {authed ? (
            <>
              <Link to="/dashboard" className="link-nav text-sm font-medium">
                Dashboard
              </Link>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="btn-ghost text-sm py-2 px-4"
              >
                Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="link-nav flex items-center gap-1 text-sm font-medium">
                <LogIn size={16} /> Entrar
              </Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">
                <UserPlus size={16} /> Cadastrar
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-[var(--text-primary)] md:hidden"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="border-t border-app bg-surface px-4 py-4 md:hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="mb-3 flex justify-end">
              <ThemeToggle showLabel />
            </div>
            {links.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="block py-2 font-medium text-[var(--text-primary)]"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {authed ? (
              <Link
                to="/dashboard"
                className="block py-2 font-medium text-[var(--text-primary)]"
                onClick={() => setOpen(false)}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block py-2 font-medium text-[var(--text-primary)]"
                  onClick={() => setOpen(false)}
                >
                  Entrar
                </Link>
                <Link
                  to="/register"
                  className="btn-primary mt-2 block text-center"
                  onClick={() => setOpen(false)}
                >
                  Cadastrar
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
