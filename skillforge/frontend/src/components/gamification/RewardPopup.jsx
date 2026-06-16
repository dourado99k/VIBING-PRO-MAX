import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { useGameStore } from '../../store/useGameStore';
import { useSound } from '../../hooks/useSound';
import { useEffect } from 'react';

export default function RewardPopup() {
  const { reward, levelUp, clearReward } = useGameStore();
  const sound = useSound();

  useEffect(() => {
    if (reward) {
      if (levelUp) sound.levelUp();
      else sound.xp();
    }
  }, [reward, levelUp]);

  return (
    <AnimatePresence>
      {(reward || levelUp) && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={clearReward}
        >
          <motion.div
            className="glass-card neon-border max-w-sm p-8 text-center"
            initial={{ scale: 0.5, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {levelUp ? (
              <>
                <TrendingUp className="mx-auto mb-4 text-neon-purple" size={56} />
                <h2 className="gradient-text text-3xl font-black">LEVEL UP!</h2>
                <p className="mt-2 text-2xl font-bold">Nível {levelUp.newLevel}</p>
                <p className="text-neon-cyan">{levelUp.levelTitle}</p>
              </>
            ) : (
              <>
                <Sparkles className="mx-auto mb-4 text-neon-cyan" size={56} />
                <h2 className="text-2xl font-bold text-neon-cyan">+{reward?.xpGained} XP</h2>
                <p className="mt-2 text-slate-400">Recompensa conquistada!</p>
              </>
            )}
            <button type="button" className="btn-primary mt-6 w-full" onClick={clearReward}>
              Continuar
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
