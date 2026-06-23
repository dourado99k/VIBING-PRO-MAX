import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Calendar,
  Users,
  CreditCard,
  FileText,
  Ban,
} from 'lucide-react';

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/quadras', label: 'Quadras', icon: MapPin },
  { to: '/admin/reservas', label: 'Reservas', icon: Calendar },
  { to: '/admin/clientes', label: 'Clientes', icon: Users },
  { to: '/admin/pagamentos', label: 'Pagamentos', icon: CreditCard },
  { to: '/admin/notas-fiscais', label: 'Notas Fiscais', icon: FileText },
  { to: '/admin/bloqueios', label: 'Bloquear Horários', icon: Ban },
];

export default function SidebarAdmin() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-sand-200 bg-white lg:block">
      <nav className="space-y-1 p-4">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-lime-100 text-primary-800 shadow-sm'
                  : 'text-muted hover:bg-primary-50 hover:text-primary-800'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function AdminMobileNav() {
  return (
    <nav className="flex gap-2 overflow-x-auto border-b border-sand-200 bg-white px-4 py-2 lg:hidden">
      {links.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-semibold ${
              isActive ? 'bg-lime-400 text-primary-900' : 'bg-primary-100 text-primary-700'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
