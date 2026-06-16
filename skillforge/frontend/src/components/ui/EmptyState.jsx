import { motion } from 'framer-motion';

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-16 text-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {Icon && (
        <div className="mb-4 rounded-2xl bg-white/5 p-4">
          <Icon className="text-neon-cyan" size={40} />
        </div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 max-w-sm text-slate-400">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </motion.div>
  );
}
