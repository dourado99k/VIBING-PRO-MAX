import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Award } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import XpBar from '../components/ui/XpBar';
import { getLevelTitle } from '../utils/levelTitles';

export default function Profile() {
  const { user: authUser, setUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: '', bio: '', avatar: '' });

  useEffect(() => {
    api.get('/users/profile').then((res) => {
      setProfile(res.data.user);
      setForm({
        name: res.data.user.name,
        bio: res.data.user.bio || '',
        avatar: res.data.user.avatar || '',
      });
    });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/users/profile', form);
      setUser(data.user);
      setProfile((p) => ({ ...p, ...data.user }));
      toast.success('Perfil atualizado!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const user = profile || authUser;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Meu Perfil</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <motion.div className="glass-card neon-border p-6 text-center lg:col-span-1" layout>
          <img
            src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name}`}
            alt=""
            className="mx-auto h-32 w-32 rounded-full border-2 border-neon-cyan/50"
          />
          <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
          <p className="text-neon-cyan">
            Nível {user?.level} · {user?.levelTitle || getLevelTitle(user?.level)}
          </p>
          <p className="mt-2 text-sm text-slate-400">{user?.bio || 'Sem bio ainda.'}</p>
          <div className="mt-6">
            <XpBar progress={user?.xpProgress} />
          </div>
        </motion.div>

        <div className="space-y-6 lg:col-span-2">
          <form onSubmit={handleSave} className="glass-card space-y-4 p-6">
            <h3 className="font-semibold">Editar perfil</h3>
            <input className="input-field" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Nome" />
            <textarea className="input-field min-h-[100px]" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Bio" />
            <input className="input-field" value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="URL do avatar" />
            <button type="submit" className="btn-primary">
              <Save size={18} /> Salvar
            </button>
          </form>

          <div className="glass-card p-6">
            <h3 className="mb-4 font-semibold">Badges & Conquistas</h3>
            <div className="flex flex-wrap gap-3">
              {(profile?.userBadges || []).map((ub) => (
                <div key={ub.id} className="rounded-xl bg-neon-purple/10 px-4 py-3 text-center">
                  <Award className="mx-auto text-neon-purple" size={28} />
                  <p className="mt-1 text-sm">{ub.badge?.name}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-neon-cyan">{profile?.missions?.length || 0}</p>
              <p className="text-sm text-slate-400">Missões recentes</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-neon-purple">
                {(profile?.userSkills || []).filter((s) => s.unlocked).length}
              </p>
              <p className="text-sm text-slate-400">Skills</p>
            </div>
            <div className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-neon-pink">{profile?.userBadges?.length || 0}</p>
              <p className="text-sm text-slate-400">Badges</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
