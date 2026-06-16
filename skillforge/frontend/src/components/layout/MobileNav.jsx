import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Target, BookOpen, Trophy, FileUp } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

const learnerItems = [
  { to: '/dashboard', icon: LayoutDashboard },
  { to: '/conteudos', icon: BookOpen },
  { to: '/missoes', icon: Target },
  { to: '/ranking', icon: Trophy },
];

const adminItems = [
  { to: '/dashboard', icon: LayoutDashboard },
  { to: '/admin/conteudos', icon: FileUp },
  { to: '/missoes', icon: Target },
  { to: '/ranking', icon: Trophy },
];

export default function MobileNav() {
  const { isOrgAdmin } = useAuthStore();
  const items = isOrgAdmin() ? adminItems : learnerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-around border-t border-app bg-surface/95 py-2 backdrop-blur-xl lg:hidden">
      {items.map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center p-2 text-xs ${isActive ? 'font-medium text-accent' : 'text-subtle'}`
          }
        >
          <Icon size={22} />
        </NavLink>
      ))}
    </nav>
  );
}
