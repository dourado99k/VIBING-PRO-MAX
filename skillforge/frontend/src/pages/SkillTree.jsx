import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, Unlock, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { CATEGORY_LABELS } from '../utils/levelTitles';

const categories = ['FRONTEND', 'BACKEND', 'DATABASE', 'SOFT_SKILLS', 'DEVOPS'];

export default function SkillTree() {
  const [skills, setSkills] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const { showReward } = useGameStore();
  const { user, setUser } = useAuthStore();

  const load = () => {
    api.get('/skills').then((res) => setSkills(res.data.skills));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUnlock = async (id) => {
    try {
      const { data } = await api.post(`/skills/${id}/unlock`);
      showReward(data.reward);
      if (data.reward?.user) setUser(data.reward.user);
      toast.success('Skill desbloqueada!');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filtered =
    filter === 'ALL' ? skills : skills.filter((s) => s.category === filter);

  const connections = skills.filter((s) => s.parentId);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <GitBranch className="text-neon-cyan" /> Skill Tree
        </h1>
        <p className="text-slate-400">Árvore de habilidades estilo RPG · Nv. {user?.level} · {user?.xp} XP</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`rounded-lg px-3 py-1.5 text-sm ${filter === 'ALL' ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-dark-700'}`}
          onClick={() => setFilter('ALL')}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-sm ${filter === c ? 'bg-neon-cyan/20 text-neon-cyan' : 'bg-dark-700'}`}
            onClick={() => setFilter(c)}
          >
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="glass-card relative min-h-[500px] overflow-auto p-8">
        <svg className="pointer-events-none absolute inset-0 h-full w-full">
          {connections.map((s) => {
            const parent = skills.find((p) => p.id === s.parentId);
            if (!parent || !filtered.includes(s) || !filtered.includes(parent)) return null;
            return (
              <line
                key={`line-${s.id}`}
                x1={parent.positionX + 80}
                y1={parent.positionY + 40}
                x2={s.positionX + 80}
                y2={s.positionY + 40}
                stroke="rgba(0,245,255,0.3)"
                strokeWidth="2"
              />
            );
          })}
        </svg>

        <div className="relative min-h-[700px]">
          {filtered.map((skill) => (
            <motion.div
              key={skill.id}
              className={`absolute w-40 rounded-xl border p-3 text-center transition ${
                skill.unlocked
                  ? 'border-neon-cyan/50 bg-neon-cyan/10'
                  : 'border-white/10 bg-dark-700/80'
              }`}
              style={{ left: skill.positionX, top: skill.positionY }}
              whileHover={{ scale: 1.05 }}
            >
              {skill.unlocked ? (
                <Unlock className="mx-auto text-neon-cyan" size={20} />
              ) : (
                <Lock className="mx-auto text-slate-500" size={20} />
              )}
              <p className="mt-2 text-xs font-semibold">{skill.name}</p>
              <p className="text-[10px] text-slate-400">Nv.{skill.requiredLevel} · {skill.xpRequired} XP</p>
              {!skill.unlocked && (
                <button
                  type="button"
                  className="mt-2 w-full rounded-lg bg-neon-purple/20 py-1 text-[10px] text-neon-purple hover:bg-neon-purple/30"
                  onClick={() => handleUnlock(skill.id)}
                >
                  Desbloquear
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
