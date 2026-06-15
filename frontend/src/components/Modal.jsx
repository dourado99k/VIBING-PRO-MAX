import { X } from 'lucide-react';
import Button from './Button';

export default function Modal({ open, onClose, title, children, footer }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-dark/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-sand-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-dark">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-muted hover:bg-sand-100 hover:text-dark"
          >
            <X size={20} />
          </button>
        </div>
        <div className="px-6 py-4">{children}</div>
        {footer && (
          <div className="flex justify-end gap-3 border-t border-sand-200 px-6 py-4">{footer}</div>
        )}
      </div>
    </div>
  );
}
