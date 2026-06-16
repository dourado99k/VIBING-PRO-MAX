import { motion } from 'framer-motion';

export default function XpBar({ progress, label, showValues = true }) {
  const percent = progress?.percent ?? 0;
  return (
    <div className="w-full">
      {label && (
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-slate-400">{label}</span>
          {showValues && (
            <span className="font-medium text-neon-cyan">
              {progress?.current ?? 0} / {progress?.needed ?? 100} XP
            </span>
          )}
        </div>
      )}
      <div className="h-3 overflow-hidden rounded-full bg-dark-700">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink"
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </div>
      {showValues && (
        <p className="mt-1 text-right text-xs text-slate-500">
          {progress?.xpToNext ?? 0} XP para o próximo nível
        </p>
      )}
    </div>
  );
}
