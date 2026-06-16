import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import ThemeToggle from '../ui/ThemeToggle';
import RewardPopup from '../gamification/RewardPopup';

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-app">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />

      <header className="fixed left-0 right-0 top-0 z-20 flex items-center justify-between border-b border-app bg-surface/90 px-4 py-3 backdrop-blur-xl lg:hidden">
        <span className="brand-logo text-base">
          Skill<span>Forge</span>
        </span>
        <ThemeToggle />
      </header>

      <main
        className={`min-h-screen bg-app pb-20 pt-16 transition-all duration-300 lg:pb-12 lg:pt-4 ${
          collapsed ? 'lg:pl-20' : 'lg:pl-64'
        } max-lg:pl-0`}
      >
        <div className="mx-auto max-w-7xl px-4 pb-12 lg:px-8">
          <Outlet />
        </div>
      </main>

      <MobileNav />
      <RewardPopup />
    </div>
  );
}
