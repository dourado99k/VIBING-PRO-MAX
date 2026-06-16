import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Flame, Target, Award, TrendingUp, Zap } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import api from '../services/api';
import XpBar from '../components/ui/XpBar';
import { CardSkeleton } from '../components/ui/Skeleton';
import { getLevelTitle } from '../utils/levelTitles';
import { useAuthStore } from '../store/useAuthStore';
import { Link } from 'react-router-dom';
import { BookOpen, FileUp } from 'lucide-react';

const weekData = [
  { day: 'Seg', xp: 120 },
  { day: 'Ter', xp: 80 },
  { day: 'Qua', xp: 200 },
  { day: 'Qui', xp: 150 },
  { day: 'Sex', xp: 300 },
  { day: 'Sáb', xp: 100 },
  { day: 'Dom', xp: 250 },
];

export default function Dashboard() {
  const { isOrgAdmin, organization } = useAuthStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/dashboard')
      .then((res) => setData(res.data.dashboard))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  }

  const user = data?.user;
  const progress = user?.xpProgress || { percent: 0, current: 0, needed: 100 };

  const progressData = [
    { name: 'Missões', value: data?.stats?.missionsCompleted || 0 },
    { name: 'Skills', value: data?.stats?.skillsUnlocked || 0 },
    { name: 'Badges', value: data?.stats?.badgesEarned || 0 },
  ];

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">
          Olá, <span className="gradient-text">{user?.name}</span>!
        </h1>
        <p className="text-muted">
          {data?.organization?.name || organization()?.name} ·{' '}
          {isOrgAdmin() ? 'Painel administrativo' : `${getLevelTitle(user?.level)} · Ranking #${data?.rankingPosition || '—'}`}
        </p>
        {isOrgAdmin() && (
          <div className="mt-4 flex flex-wrap gap-3">
            <Link to="/admin/conteudos" className="btn-primary text-sm py-2">
              <FileUp size={16} /> Gerenciar conteúdos
            </Link>
            <Link to="/conteudos" className="btn-ghost text-sm py-2">
              <BookOpen size={16} /> Ver como aluno
            </Link>
          </div>
        )}
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        <motion.div className="glass-card neon-border p-6 lg:col-span-2" layout>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-sm text-slate-400">Nível atual</p>
              <p className="text-5xl font-black text-neon-cyan">{user?.level}</p>
              <p className="text-lg">{user?.levelTitle || getLevelTitle(user?.level)}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">XP Total</p>
              <p className="text-2xl font-bold">{user?.xp?.toLocaleString()}</p>
            </div>
          </div>
          <div className="mt-6">
            <XpBar progress={progress} label="Progresso de XP" />
          </div>
        </motion.div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-2 text-orange-400">
            <Flame size={24} />
            <span className="font-semibold">Streak</span>
          </div>
          <p className="mt-4 text-4xl font-black">{data?.streak?.currentStreak || 0}</p>
          <p className="text-sm text-slate-400">dias consecutivos</p>
          <p className="mt-2 text-xs text-slate-500">Recorde: {data?.streak?.longestStreak || 0} dias</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Target, label: 'Missões ativas', value: data?.dailyMissions?.length || 0, color: 'text-neon-cyan' },
          { icon: Zap, label: 'XP semanal', value: data?.weeklyXp || 0, color: 'text-neon-purple' },
          { icon: Award, label: 'Badges', value: data?.badges?.length || 0, color: 'text-neon-pink' },
          { icon: TrendingUp, label: 'Skills', value: data?.unlockedSkills?.length || 0, color: 'text-green-400' },
        ].map((s) => (
          <div key={s.label} className="glass-card p-4">
            <s.icon className={s.color} size={24} />
            <p className="mt-2 text-2xl font-bold">{s.value}</p>
            <p className="text-sm text-slate-400">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Evolução semanal (XP)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={weekData}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00f5ff" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #333' }} />
              <Area type="monotone" dataKey="xp" stroke="#00f5ff" fill="url(#xpGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Progresso geral</h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={progressData}>
              <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip contentStyle={{ background: '#1a1a26', border: '1px solid #333' }} />
              <Bar dataKey="value" fill="#a855f7" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Missões diárias</h3>
          <div className="space-y-3">
            {(data?.dailyMissions || []).slice(0, 5).map((m) => (
              <div key={m.id} className="flex items-center justify-between rounded-xl bg-dark-700/50 p-3">
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-xs text-slate-400">{m.category} · +{m.xpReward} XP</p>
                </div>
                <span className="rounded-full bg-neon-cyan/10 px-2 py-1 text-xs text-neon-cyan">{m.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="mb-4 font-semibold">Badges recentes</h3>
          <div className="flex flex-wrap gap-3">
            {(data?.badges || []).map((ub) => (
              <div key={ub.id} className="rounded-xl bg-gradient-to-br from-neon-purple/20 to-neon-cyan/10 px-4 py-3 text-center">
                <Award className="mx-auto text-neon-purple" size={24} />
                <p className="mt-1 text-xs font-medium">{ub.badge?.name}</p>
              </div>
            ))}
            {!data?.badges?.length && <p className="text-slate-400">Complete missões para ganhar badges!</p>}
          </div>
        </div>
      </div>

      {data?.careerMap && (
        <div className="glass-card neon-border p-6">
          <h3 className="font-semibold text-neon-cyan">Mapa de Evolução Profissional</h3>
          <p className="mt-2 text-lg">{data.careerMap.primaryMessage}</p>
          <div className="mt-4 h-3 overflow-hidden rounded-full bg-dark-700">
            <div
              className="h-full bg-gradient-to-r from-neon-cyan to-neon-purple transition-all"
              style={{ width: `${data.careerMap.overallPercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
