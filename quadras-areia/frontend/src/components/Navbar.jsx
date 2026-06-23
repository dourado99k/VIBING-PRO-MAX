import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import Button from './Button';
import BrandLogo from './BrandLogo';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuthStore();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const homeLink = user ? (isAdmin() ? '/admin' : '/cliente') : '/';

  const clienteLinks = [
    { to: '/cliente', label: 'Início' },
    { to: '/quadras', label: 'Quadras' },
    { to: '/minhas-reservas', label: 'Minhas Reservas' },
    { to: '/perfil', label: 'Perfil' },
  ];

  const links = isAdmin()
    ? [{ to: '/admin', label: 'Painel Admin' }]
    : clienteLinks;

  return (
    <header className="sticky top-0 z-40 border-b border-primary-200/60 bg-white/95 shadow-sm backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 sm:px-6">
        <Link to={homeLink}>
          <BrandLogo size="md" showAddress link={false} />
        </Link>

        {user && (
          <>
            <nav className="hidden items-center gap-6 md:flex">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  className="text-sm font-semibold text-primary-700 transition-colors hover:text-lime-600"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex items-center gap-3 border-l border-sand-200 pl-6">
                <span className="flex items-center gap-1 text-sm font-medium text-dark">
                  <User size={16} className="text-lime-600" /> {user.name}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  <LogOut size={16} /> Sair
                </Button>
              </div>
            </nav>

            <button
              className="rounded-lg p-2 text-primary-700 md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}

        {!user && (
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button size="sm">Cadastrar</Button>
            </Link>
          </div>
        )}
      </div>

      {user && mobileOpen && (
        <nav className="border-t border-sand-200 bg-white px-4 py-4 md:hidden">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="block py-2 text-sm font-semibold text-primary-700"
              onClick={() => setMobileOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-2 py-2 text-sm text-danger"
          >
            <LogOut size={16} /> Sair
          </button>
        </nav>
      )}
    </header>
  );
}
