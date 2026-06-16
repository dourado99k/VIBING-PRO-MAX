import { useEffect, useState } from 'react';
import { Settings, Gamepad2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function OrgConfig() {
  const [org, setOrg] = useState(null);
  const [stats, setStats] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    industry: '',
    welcomeMessage: '',
    gamificationEnabled: true,
  });

  useEffect(() => {
    Promise.all([api.get('/organizations/me'), api.get('/organizations/stats')])
      .then(([o, s]) => {
        setOrg(o.data.organization);
        setStats(s.data.stats);
        setForm({
          name: o.data.organization.name,
          description: o.data.organization.description || '',
          industry: o.data.organization.industry || '',
          welcomeMessage: o.data.organization.welcomeMessage || '',
          gamificationEnabled: o.data.organization.gamificationEnabled,
        });
      })
      .catch((e) => toast.error(e.message));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put('/organizations/me', form);
      setOrg(data.organization);
      toast.success('Configurações salvas!');
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="flex items-center gap-2 text-3xl font-bold">
          <Settings className="icon-accent" /> Configurar gamificação
        </h1>
        <p className="text-muted">Personalize a experiência da sua organização</p>
      </div>

      {stats && (
        <div className="grid gap-4 sm:grid-cols-4">
          {[
            { label: 'Alunos', value: stats.learners },
            { label: 'Conteúdos', value: stats.contents },
            { label: 'Publicados', value: stats.publishedContents },
            { label: 'Missões', value: stats.missions },
          ].map((s) => (
            <div key={s.label} className="glass-card p-4 text-center">
              <p className="text-2xl font-bold text-accent">{s.value}</p>
              <p className="text-sm text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSave} className="glass-card max-w-2xl space-y-4 p-6">
        <p className="text-sm text-muted">
          Código da organização (alunos usam no cadastro):{' '}
          <strong className="text-accent">{org?.slug}</strong>
        </p>
        <input className="input-field" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input-field" placeholder="Segmento" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        <textarea className="input-field min-h-[80px]" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <textarea className="input-field min-h-[80px]" placeholder="Mensagem de boas-vindas para alunos" value={form.welcomeMessage} onChange={(e) => setForm({ ...form, welcomeMessage: e.target.value })} />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.gamificationEnabled}
            onChange={(e) => setForm({ ...form, gamificationEnabled: e.target.checked })}
          />
          <Gamepad2 size={16} /> Gamificação ativa (XP, missões, ranking)
        </label>
        <button type="submit" className="btn-primary">
          Salvar configurações
        </button>
      </form>
    </div>
  );
}
