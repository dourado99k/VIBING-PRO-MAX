import { useEffect, useState } from 'react';
import { Calendar, DollarSign, Clock, CreditCard } from 'lucide-react';
import Navbar from '../components/Navbar';
import SidebarAdmin, { AdminMobileNav } from '../components/SidebarAdmin';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import Loading from '../components/Loading';
import api from '../services/api';

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/bookings/dashboard/stats')
      .then((res) => setStats(res.data.stats))
      .finally(() => setLoading(false));
  }, []);

  const cards = stats
    ? [
        { label: 'Total de reservas', value: stats.totalBookings, icon: Calendar, color: 'bg-primary-50 text-primary-600' },
        { label: 'Reservas do dia', value: stats.todayBookings, icon: Clock, color: 'bg-blue-50 text-blue-600' },
        { label: 'Faturamento estimado', value: `R$ ${stats.estimatedRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-success-light text-success-dark' },
        { label: 'Reservas pendentes', value: stats.pendingBookings, icon: Calendar, color: 'bg-amber-50 text-amber-600' },
        { label: 'Pagamentos pendentes', value: stats.pendingPayments, icon: CreditCard, color: 'bg-red-50 text-red-600' },
      ]
    : [];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <SidebarAdmin />
        <div className="flex-1">
          <AdminMobileNav />
          <div className="page-container">
            <PageHeader title="Dashboard" subtitle="Visão geral do negócio" />
            {loading ? (
              <Loading />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {cards.map(({ label, value, icon: Icon, color }) => (
                  <Card key={label}>
                    <div className="flex items-center gap-4">
                      <div className={`rounded-xl p-3 ${color}`}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <p className="text-sm text-muted">{label}</p>
                        <p className="text-2xl font-bold text-dark">{value}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
