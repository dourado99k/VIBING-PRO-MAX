import { useEffect, useState } from 'react';
import { FileUp, Trash2, Eye, EyeOff, FileText, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api';
import EmptyState from '../components/ui/EmptyState';

const API_BASE = import.meta.env.VITE_API_URL?.replace('/api', '') || '';

export default function ContentManage() {
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [publish, setPublish] = useState(true);

  const load = () => {
    api
      .get('/contents')
      .then((res) => setContents(res.data.contents))
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Selecione um PDF ou imagem');
      return;
    }
    const form = new FormData();
    form.append('file', file);
    form.append('title', title);
    form.append('description', description);
    form.append('isPublished', publish ? 'true' : 'false');

    setUploading(true);
    try {
      await api.post('/contents/upload', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Conteúdo enviado!');
      setTitle('');
      setDescription('');
      setFile(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setUploading(false);
    }
  };

  const togglePublish = async (c) => {
    try {
      await api.put(`/contents/${c.id}`, { isPublished: !c.isPublished });
      toast.success(c.isPublished ? 'Despublicado' : 'Publicado');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Excluir este conteúdo?')) return;
    try {
      await api.delete(`/contents/${id}`);
      toast.success('Removido');
      load();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const fileUrl = (url) => (url.startsWith('http') ? url : `${API_BASE}${url}`);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Gerenciar conteúdos</h1>
        <p className="text-muted">Envie PDFs e imagens para seus alunos</p>
      </div>

      <form onSubmit={handleUpload} className="glass-card space-y-4 p-6">
        <h2 className="flex items-center gap-2 font-semibold">
          <FileUp className="icon-accent" size={22} /> Novo upload
        </h2>
        <input className="input-field" placeholder="Título do material" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <textarea className="input-field min-h-[72px]" placeholder="Descrição (opcional)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input
          type="file"
          accept=".pdf,image/jpeg,image/png,image/webp,image/gif"
          className="input-field"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
        />
        <label className="flex items-center gap-2 text-sm text-muted">
          <input type="checkbox" checked={publish} onChange={(e) => setPublish(e.target.checked)} />
          Publicar imediatamente para alunos
        </label>
        <button type="submit" className="btn-primary" disabled={uploading}>
          {uploading ? 'Enviando...' : 'Enviar conteúdo'}
        </button>
      </form>

      {loading ? (
        <p className="text-muted">Carregando...</p>
      ) : contents.length === 0 ? (
        <EmptyState
          icon={FileUp}
          title="Nenhum conteúdo"
          description="Faça upload do primeiro PDF ou imagem da sua organização."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {contents.map((c) => (
            <div key={c.id} className="glass-card p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {c.type === 'PDF' ? (
                    <FileText className="text-red-400" size={24} />
                  ) : (
                    <ImageIcon className="icon-accent" size={24} />
                  )}
                  <div>
                    <h3 className="font-semibold">{c.title}</h3>
                    <p className="text-xs text-muted">{c.type} · {c.fileName}</p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    c.isPublished ? 'bg-green-500/15 text-green-600' : 'bg-muted-surface text-muted'
                  }`}
                >
                  {c.isPublished ? 'Publicado' : 'Rascunho'}
                </span>
              </div>
              {c.description && <p className="mt-2 line-clamp-2 text-sm text-muted">{c.description}</p>}
              <div className="mt-4 flex gap-2">
                <a href={fileUrl(c.fileUrl)} target="_blank" rel="noreferrer" className="btn-ghost flex-1 py-2 text-sm">
                  Abrir
                </a>
                <button type="button" className="rounded-lg p-2 hover:bg-muted-surface" onClick={() => togglePublish(c)} title={c.isPublished ? 'Despublicar' : 'Publicar'}>
                  {c.isPublished ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
                <button type="button" className="rounded-lg p-2 text-red-400 hover:bg-red-500/10" onClick={() => handleDelete(c.id)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
