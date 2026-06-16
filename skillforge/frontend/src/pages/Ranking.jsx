import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Flame, Medal } from 'lucide-react';
import api from '../services/api';
import { CardSkeleton } from '../components/ui/Skeleton';
import EmptyState from '../components/ui/EmptyState';
import { useAuthStore } from '../store/useAuthStore';

export default function Ranking() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const { organization } = useAuthStore();

  useEffect(() => {
    api
      .get('/rankings')
      .then((res) => setLeaderboard(res.data.leaderboard))
      .catch(() => setLeaderboard([]))
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const podiumColors = ['text-yellow-400', 'text-slate-300', 'text-amber-600'];
  const podiumHeights = ['h-32', 'h-24', 'h-20'];

  if (loading) return <CardSkeleton />;

  if (leaderboard.length === 0) {
    return (
      <EmptyState
        icon={Trophy}
        title="Ranking vazio"
        description="Ainda não há alunos com XP nesta organização."
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="flex items-center justify-center gap-2 text-3xl font-bold">
          <Trophy className="text-yellow-400" /> Ranking da turma
        </h1>
        <p className="text-muted">
          {organization()?.name || 'Sua organização'} · {leaderboard.length} participantes
        </p>
      </div>

      {top3.length > 0 && (
        <div className="flex items-end justify-center gap-4 px-4">
          {[1, 0, 2].map((idx) => {
            const player = top3[idx];
            if (!player) return null;
            return (
              <motion.div
                key={player.id}
                className={`flex flex-col items-center ${idx === 0 ? 'order-2' : idx === 1 ? 'order-1' : 'order-3'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <img
                  src={player.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}`}
                  alt=""
                  className={`rounded-full border-2 ${idx === 0 ? 'h-20 w-20 border-yellow-400' : 'h-14 w-14 border-app'}`}
                />
                <p className="mt-2 max-w-[100px] truncate text-sm font-semibold">{player.name}</p>
                <p className="text-xs text-accent">Nv. {player.level}</p>
                <div
                  className={`mt-2 w-24 rounded-t-xl bg-gradient-to-t from-neon-purple/30 to-neon-cyan/20 ${podiumHeights[idx]} flex items-start justify-center pt-2`}
                >
                  <Medal className={podiumColors[idx]} size={24} />
                </div>
                <p className="text-xs text-muted">{player.xp?.toLocaleString()} XP</p>
              </motion.div>
            );
          })}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-app text-left text-sm text-muted">
              <th className="p-4">#</th>
              <th className="p-4">Nome</th>
              <th className="p-4 hidden sm:table-cell">Level</th>
              <th className="p-4">XP</th>
              <th className="p-4 hidden md:table-cell">Streak</th>
            </tr>
          </thead>
          <tbody>
            {(rest.length > 0 ? rest : leaderboard).map((p, i) => {
              if (rest.length === 0 && i < 3) return null;
              return (
                <tr key={p.id} className="border-b border-app transition hover:bg-muted-surface/30">
                  <td className="p-4 font-mono text-accent">{p.position}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`}
                        alt=""
                        className="h-8 w-8 rounded-full"
                      />
                      {p.name}
                    </div>
                  </td>
                  <td className="p-4 hidden sm:table-cell">{p.level}</td>
                  <td className="p-4 font-semibold">{p.xp?.toLocaleString()}</td>
                  <td className="p-4 hidden md:table-cell">
                    <span className="flex items-center gap-1 text-orange-400">
                      <Flame size={14} /> {p.streak}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
