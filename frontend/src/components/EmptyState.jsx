import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'Nada por aqui', description, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-sand-300 bg-sand-50 py-16 text-center">
      <Icon className="mb-4 text-sand-400" size={48} />
      <h3 className="text-lg font-semibold text-dark">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>}
    </div>
  );
}
