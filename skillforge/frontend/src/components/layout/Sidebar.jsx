import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Target,
  GitBranch,
  Trophy,
  User,
  CreditCard,
  Map,
  ChevronLeft,
  ChevronRight,
  Crown,
  FileUp,
  BookOpen,
  Settings,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import ThemeToggle from '../ui/ThemeToggle';

const learnerNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/conteudos', icon: BookOpen, label: 'Conteúdos' },
  { to: '/missoes', icon: Target, label: 'Atividades' },
  { to: '/skill-tree', icon: GitBranch, label: 'Habilidades' },
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/evolucao', icon: Map, label: 'Minha trilha' },
  { to: '/perfil', icon: User, label: 'Perfil' },
];

const adminNav = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/conteudos', icon: FileUp, label: 'Gerenciar conteúdos' },
  { to: '/missoes', icon: Target, label: 'Missões / Atividades' },
  { to: '/skill-tree', icon: GitBranch, label: 'Skill Tree' },
  { to: '/admin/config', icon: Settings, label: 'Gamificação' },
  { to: '/admin/alunos', icon: Users, label: 'Alunos' },
  { to: '/ranking', icon: Trophy, label: 'Ranking' },
  { to: '/planos', icon: CreditCard, label: 'Planos' },
];

export default function Sidebar({ collapsed, onToggle }) {
  const { user, isOrgAdmin, isPremium, organization } = useAuthStore();
  const navItems = isOrgAdmin() ? adminNav : learnerNav;

  return (
    <aside
      className={`fixed left-0 top-0 z-30 hidden h-full flex-col border-r border-app bg-surface/95 pt-20 backdrop-blur-xl transition-all duration-300 lg:flex ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="absolute -right-3 top-24 rounded-full border border-app bg-surface-elevated p-1.5 hover:bg-muted-surface"
      >
        {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
      </button>

      {!collapsed && user && (
        <div className="mx-4 mb-6 rounded-xl bg-accent-bg p-4">
          <p className="truncate text-xs font-semibold uppercase tracking-wide text-accent">
            {organization()?.name || 'Organização'}
          </p>
          <p className="mt-1 truncate font-semibold">{user.name}</p>
          <p className="text-xs text-muted">
            {isOrgAdmin() ? 'Administrador' : `Nv. ${user.level}`}
          </p>
          {isPremium() && (
            <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-neon-purple/20 px-2 py-0.5 text-xs text-accent-secondary">
              <Crown size={12} /> Premium
            </span>
          )}
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                isActive
                  ? 'bg-accent-bg font-medium text-accent'
                  : 'text-muted hover:bg-muted-surface/50 hover:text-[var(--text-primary)]'
              }`
            }
            title={label}
          >
            <Icon size={20} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className={`mt-auto border-t border-app p-3 ${collapsed ? 'flex justify-center' : ''}`}>
        <ThemeToggle showLabel={!collapsed} className={collapsed ? '' : 'w-full justify-center'} />
      </div>
    </aside>
  );
}
