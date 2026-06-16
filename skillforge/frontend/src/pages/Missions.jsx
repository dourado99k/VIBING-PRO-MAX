import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Pencil, Trash2, CheckCircle, Swords, Star, Heart } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import Modal from '../components/ui/Modal';
import EmptyState from '../components/ui/EmptyState';
import { useGameStore } from '../store/useGameStore';
import { useAuthStore } from '../store/useAuthStore';
import { DIFFICULTY_LABELS } from '../utils/levelTitles';

const emptyForm = {
  title: '',
  description: '',
  difficulty: 'EASY',
  category: '',
  xpReward: 50,
  deadline: '',
  isBoss: false,
};

const FILTERS = [
  { id: 'all', label: 'Todas' },
  { id: 'favorites', label: 'Favoritas' },
];

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const { showReward } = useGameStore();
  const { setUser } = useAuthStore();

  const load = (favFilter = filter) => {
    setLoading(true);
    const url = favFilter === 'favorites' ? '/missions?favorites=true' : '/missions';
    api
      .get(url)
      .then((res) => setMissions(res.data.missions))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load(filter);
  }, [filter]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (m) => {
    setEditing(m);
    setForm({
      title: m.title,
      description: m.description,
      difficulty: m.difficulty,
      category: m.category,
      xpReward: m.xpReward,
      deadline: m.deadline ? m.deadline.slice(0, 16) : '',
      isBoss: m.isBoss,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        xpReward: Number(form.xpReward),
        deadline: form.deadline ? new Date(form.deadline).toISOString() : null,
      };
      if (editing) {
        await api.put(`/missions/${editing.id}`, payload);
        toast.success('Missão atualizada!');
      } else {
        await api.post('/missions', payload);
        toast.success('Missão criada!');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir esta missão?')) return;
    try {
      await api.delete(`/missions/${id}`);
      toast.success('Missão excluída');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleComplete = async (id) => {
    try {
      const { data } = await api.post(`/missions/${id}/complete`);
      showReward(data.reward);
      if (data.reward?.user) setUser(data.reward.user);
      toast.success(`+${data.reward?.xpGained} XP!`);
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleFavorite = async (mission) => {
    try {
      const { data } = await api.post(`/missions/${mission.id}/favorite`);
      toast.success(data.message);
      if (filter === 'favorites' && !data.isFavorite) {
        setMissions((prev) => prev.filter((m) => m.id !== mission.id));
      } else {
        setMissions((prev) =>
          prev.map((m) => (m.id === mission.id ? { ...m, isFavorite: data.isFavorite } : m))
        );
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const favoriteCount = missions.filter((m) => m.isFavorite).length;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Missões</h1>
          <p className="text-muted">Complete desafios e ganhe XP</p>
        </div>
        <button type="button" className="btn-primary" onClick={openCreate}>
          <Plus size={18} /> Nova Missão
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition ${
              filter === f.id
                ? 'bg-neon-cyan/15 text-neon-cyan'
                : 'bg-surface-elevated text-muted hover:text-[var(--text-primary)]'
            }`}
          >
            {f.id === 'favorites' && <Heart size={16} />}
            {f.label}
            {f.id === 'favorites' && filter !== 'favorites' && favoriteCount > 0 && (
              <span className="rounded-full bg-neon-purple/20 px-1.5 text-xs">{favoriteCount}</span>
            )}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : missions.length === 0 ? (
        <EmptyState
          icon={filter === 'favorites' ? Heart : Swords}
          title={filter === 'favorites' ? 'Nenhum favorito' : 'Nenhuma missão'}
          description={
            filter === 'favorites'
              ? 'Clique na estrela em uma missão para adicioná-la aos favoritos.'
              : 'Crie sua primeira missão e comece a ganhar XP!'
          }
          action={
            filter === 'favorites' ? (
              <button type="button" className="btn-ghost" onClick={() => setFilter('all')}>
                Ver todas as missões
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={openCreate}>
                Criar missão
              </button>
            )
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {missions.map((m, i) => {
            const diff = DIFFICULTY_LABELS[m.difficulty] || DIFFICULTY_LABELS.EASY;
            return (
              <motion.div
                key={m.id}
                className={`glass-card relative p-5 ${m.isBoss ? 'neon-border border-red-500/30' : ''} ${
                  m.isFavorite ? 'ring-1 ring-yellow-400/30' : ''
                }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  type="button"
                  onClick={() => handleToggleFavorite(m)}
                  className={`absolute right-3 top-3 rounded-lg p-2 transition ${
                    m.isFavorite
                      ? 'text-yellow-400 hover:bg-yellow-400/10'
                      : 'text-muted hover:bg-muted-surface/50 hover:text-yellow-400'
                  }`}
                  title={m.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                  aria-label={m.isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                >
                  <Star size={20} className={m.isFavorite ? 'fill-current' : ''} />
                </button>

                <div className="flex items-start justify-between pr-10">
                  <div>
                    {m.isBoss && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-0.5 text-xs text-red-400">
                        <Swords size={12} /> Boss Fight
                      </span>
                    )}
                    <h3 className="font-semibold">{m.title}</h3>
                    <p className="mt-1 line-clamp-2 text-sm text-muted">{m.description}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-1 text-xs ${diff.bg} ${diff.color}`}>
                    {diff.label}
                  </span>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted">
                  <span>{m.category}</span>
                  <span>+{m.xpReward} XP</span>
                  {m.deadline && <span>Prazo: {new Date(m.deadline).toLocaleDateString('pt-BR')}</span>}
                </div>
                <div className="mt-4 flex gap-2">
                  {m.status !== 'COMPLETED' && (
                    <button
                      type="button"
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-500/20 py-2 text-sm text-green-500 hover:bg-green-500/30"
                      onClick={() => handleComplete(m.id)}
                    >
                      <CheckCircle size={16} /> Concluir
                    </button>
                  )}
                  <button
                    type="button"
                    className="rounded-lg p-2 hover:bg-muted-surface/50"
                    onClick={() => openEdit(m)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg p-2 text-red-400 hover:bg-red-500/10"
                    onClick={() => handleDelete(m.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <span className="mt-2 block text-xs text-subtle">Status: {m.status}</span>
              </motion.div>
            );
          })}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Missão' : 'Nova Missão'}>
        <form onSubmit={handleSave} className="space-y-4">
          <input className="input-field" placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <textarea className="input-field min-h-[80px]" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="grid grid-cols-2 gap-4">
            <select className="input-field" value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })}>
              <option value="EASY">Fácil</option>
              <option value="MEDIUM">Médio</option>
              <option value="HARD">Difícil</option>
              <option value="BOSS">Boss</option>
            </select>
            <input className="input-field" type="number" placeholder="XP" value={form.xpReward} onChange={(e) => setForm({ ...form, xpReward: e.target.value })} />
          </div>
          <input className="input-field" placeholder="Categoria" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <input type="datetime-local" className="input-field" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          <label className="flex items-center gap-2 text-sm text-muted">
            <input type="checkbox" checked={form.isBoss} onChange={(e) => setForm({ ...form, isBoss: e.target.checked })} />
            Boss Fight (XP alto)
          </label>
          <button type="submit" className="btn-primary w-full">
            {editing ? 'Salvar' : 'Criar'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
