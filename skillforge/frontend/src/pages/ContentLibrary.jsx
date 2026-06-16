import { useEffect, useState } from 'react';
import { BookOpen, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import EmptyState from '../components/ui/EmptyState';
import { useAuthStore } from '../store/useAuthStore';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function ContentLibrary() {
  const [contents, setContents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const { organization } = useAuthStore();

  useEffect(() => {
    api
      .get('/contents')
      .then((res) => {
        setContents(res.data.contents);
        if (res.data.contents[0]) setSelected(res.data.contents[0]);
      })
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fileUrl = (url) => (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Conteúdos</h1>
        <p className="text-muted">
          Materiais de <span className="font-medium text-accent">{organization()?.name}</span>
        </p>
        {organization()?.welcomeMessage && (
          <p className="mt-2 rounded-xl bg-accent-bg px-4 py-3 text-sm text-[var(--text-primary)]">
            {organization().welcomeMessage}
          </p>
        )}
      </div>

      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="Nenhum material publicado"
          description="Aguarde seu instrutor publicar PDFs e imagens."
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2 lg:col-span-1">
            {contents.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setSelected(c)}
                className={`w-full rounded-xl border p-4 text-left transition ${
                  selected?.id === c.id
                    ? 'border-accent bg-accent-bg'
                    : 'border-app bg-surface hover:bg-muted-surface/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {c.type === 'PDF' ? <FileText size={18} /> : <ImageIcon size={18} className="icon-accent" />}
                  <span className="font-medium">{c.title}</span>
                </div>
                <p className="mt-1 line-clamp-1 text-xs text-muted">{c.description}</p>
              </button>
            ))}
          </div>

          <div className="glass-card min-h-[400px] p-4 lg:col-span-2">
            {selected && (
              <>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold">{selected.title}</h2>
                  <a
                    href={fileUrl(selected.fileUrl)}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost flex items-center gap-1 py-2 text-sm"
                  >
                    <ExternalLink size={16} /> Abrir em nova aba
                  </a>
                </div>
                {selected.description && <p className="mb-4 text-muted">{selected.description}</p>}
                {selected.type === 'IMAGE' ? (
                  <img
                    src={fileUrl(selected.fileUrl)}
                    alt={selected.title}
                    className="mx-auto max-h-[520px] rounded-xl object-contain"
                  />
                ) : (
                  <iframe
                    title={selected.title}
                    src={fileUrl(selected.fileUrl)}
                    className="h-[520px] w-full rounded-xl border border-app bg-white"
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
