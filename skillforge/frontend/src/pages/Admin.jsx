import { useEffect, useState } from 'react';
import { Shield, Users, Target, Award, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/ui/Modal';

const tabs = [
  { id: 'users', label: 'Usuários', icon: Users },
  { id: 'missions', label: 'Missões', icon: Target },
  { id: 'badges', label: 'Badges', icon: Award },
  { id: 'skills', label: 'Skills', icon: GitBranch },
];

export default function Admin() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [missions, setMissions] = useState([]);
  const [badges, setBadges] = useState([]);
  const [skills, setSkills] = useState([]);
  const [modal, setModal] = useState({ open: false, type: '', data: {} });

  const load = async () => {
    try {
      const [u, m, b, s] = await Promise.all([
        api.get('/users'),
        api.get('/missions?all=true'),
        api.get('/badges'),
        api.get('/skills'),
      ]);
      setUsers(u.data.users);
      setMissions(m.data.missions);
      setBadges(b.data.badges);
      setSkills(s.data.skills);
    } catch (e) {
      toast.error(e.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!confirm('Remover usuário?')) return;
    await api.delete(`/users/${id}`);
    toast.success('Usuário removido');
    load();
  };

  const handleDeleteMission = async (id) => {
    await api.delete(`/missions/${id}`);
    toast.success('Missão removida');
    load();
  };

  const handleDeleteBadge = async (id) => {
    await api.delete(`/badges/${id}`);
    toast.success('Badge removida');
    load();
  };

  const handleDeleteSkill = async (id) => {
    await api.delete(`/skills/${id}`);
    toast.success('Skill removida');
    load();
  };

  const refreshRankings = async () => {
    await api.post('/rankings/refresh');
    toast.success('Rankings atualizados');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Shield className="text-red-400" /> Painel Admin
        </h1>
        <button type="button" className="btn-ghost text-sm" onClick={refreshRankings}>
          Atualizar Rankings
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm ${
              tab === t.id ? 'bg-red-500/20 text-red-400' : 'bg-dark-700'
            }`}
          >
            <t.icon size={16} /> {t.label}
          </button>
        ))}
      </div>

      <div className="glass-card overflow-x-auto">
        {tab === 'users' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="p-3">Nome</th>
                <th className="p-3">E-mail</th>
                <th className="p-3">Role</th>
                <th className="p-3">Plano</th>
                <th className="p-3">XP</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-white/5">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">{u.role}</td>
                  <td className="p-3">{u.plan}</td>
                  <td className="p-3">{u.xp}</td>
                  <td className="p-3">
                    <button type="button" className="text-red-400" onClick={() => handleDeleteUser(u.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'missions' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="p-3">Título</th>
                <th className="p-3">Dificuldade</th>
                <th className="p-3">XP</th>
                <th className="p-3">Status</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {missions.map((m) => (
                <tr key={m.id} className="border-b border-white/5">
                  <td className="p-3">{m.title}</td>
                  <td className="p-3">{m.difficulty}</td>
                  <td className="p-3">{m.xpReward}</td>
                  <td className="p-3">{m.status}</td>
                  <td className="p-3">
                    <button type="button" className="text-red-400" onClick={() => handleDeleteMission(m.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'badges' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="p-3">Nome</th>
                <th className="p-3">Premium</th>
                <th className="p-3">XP Bônus</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {badges.map((b) => (
                <tr key={b.id} className="border-b border-white/5">
                  <td className="p-3">{b.name}</td>
                  <td className="p-3">{b.isPremium ? 'Sim' : 'Não'}</td>
                  <td className="p-3">{b.xpBonus}</td>
                  <td className="p-3">
                    <button type="button" className="text-red-400" onClick={() => handleDeleteBadge(b.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === 'skills' && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-slate-400">
                <th className="p-3">Nome</th>
                <th className="p-3">Categoria</th>
                <th className="p-3">Nível req.</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {skills.map((s) => (
                <tr key={s.id} className="border-b border-white/5">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.category}</td>
                  <td className="p-3">{s.requiredLevel}</td>
                  <td className="p-3">
                    <button type="button" className="text-red-400" onClick={() => handleDeleteSkill(s.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
