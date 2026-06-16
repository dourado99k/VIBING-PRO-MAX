import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Map, Target, AlertCircle } from 'lucide-react';
import api from '../services/api';
import { CardSkeleton } from '../components/ui/Skeleton';

export default function CareerMap() {
  const [careerMap, setCareerMap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/profile')
      .then((res) => setCareerMap(res.data.user.careerMap))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CardSkeleton />;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Map className="icon-accent" /> Minha trilha de aprendizado
        </h1>
        <p className="text-muted">Progresso na organização e habilidades</p>
      </div>

      <motion.div
        className="glass-card neon-border p-8 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <p className="text-2xl font-bold gradient-text">{careerMap?.primaryMessage}</p>
        <div className="mx-auto mt-6 max-w-xl">
          <div className="mb-2 flex justify-between text-sm">
            <span>Progresso geral</span>
            <span className="text-neon-cyan">{careerMap?.overallPercent}%</span>
          </div>
          <div className="h-4 overflow-hidden rounded-full bg-dark-700">
            <motion.div
              className="h-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
              initial={{ width: 0 }}
              animate={{ width: `${careerMap?.overallPercent || 0}%` }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {(careerMap?.tracks || []).map((track, i) => (
          <motion.div
            key={track.career}
            className="glass-card p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="flex items-start justify-between">
              <div>
                <Target className="text-neon-purple" size={24} />
                <h3 className="mt-2 font-semibold">{track.career}</h3>
              </div>
              <span className="text-3xl font-black text-neon-cyan">{track.percent}%</span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-dark-700">
              <div
                className="h-full bg-neon-cyan transition-all"
                style={{ width: `${track.percent}%` }}
              />
            </div>
            {track.missingSkills?.length > 0 && (
              <div className="mt-4">
                <p className="flex items-center gap-1 text-sm text-slate-400">
                  <AlertCircle size={14} /> Skills faltando:
                </p>
                <ul className="mt-2 space-y-1">
                  {track.missingSkills.map((s) => (
                    <li key={s} className="text-sm text-orange-400/80">
                      • {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
