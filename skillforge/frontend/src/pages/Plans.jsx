import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, BarChart3, Award } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

const plans = [
  {
    id: 'FREE',
    name: 'Free',
    price: 'R$ 0',
    desc: 'Ideal para começar sua jornada',
    features: ['Missões básicas', 'Skill tree limitada', 'Ranking global', '5 missões/dia'],
    cta: 'Plano atual',
    highlight: false,
  },
  {
    id: 'PREMIUM',
    name: 'Premium',
    price: 'R$ 29,90/mês',
    desc: 'Para alunos que querem acelerar',
    features: [
      'Dashboard premium',
      'Badges exclusivas',
      'Analytics avançados',
      'Boss fights ilimitados',
      'Streak boost 2x XP',
      'Mapa de evolução detalhado',
    ],
    cta: 'Assinar Premium',
    highlight: true,
  },
];

export default function Plans() {
  const { isPremium, isAuthenticated } = useAuthStore();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Planos B2B SkillForge</h1>
        <p className="text-muted">Sua organização gamifica conteúdos — escale com premium</p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.id}
            className={`glass-card relative p-8 ${plan.highlight ? 'neon-border scale-105' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-neon-purple px-4 py-1 text-xs font-bold">
                RECOMENDADO
              </span>
            )}
            {plan.id === 'PREMIUM' && <Crown className="mb-4 text-neon-purple" size={32} />}
            {plan.id === 'FREE' && <Zap className="mb-4 text-neon-cyan" size={32} />}
            <h2 className="text-2xl font-bold">{plan.name}</h2>
            <p className="text-3xl font-black gradient-text">{plan.price}</p>
            <p className="mt-2 text-sm text-slate-400">{plan.desc}</p>
            <ul className="mt-6 space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="shrink-0 text-green-400" size={16} /> {f}
                </li>
              ))}
            </ul>
            {plan.id === 'PREMIUM' ? (
              <div className="mt-8 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <BarChart3 size={16} /> Analytics avançados
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Award size={16} /> Badges exclusivas Premium Pioneer
                </div>
                {isPremium() ? (
                  <p className="btn-ghost mt-4 w-full text-center opacity-70">Você já é Premium</p>
                ) : (
                  <Link
                    to={isAuthenticated() ? '/dashboard' : '/register'}
                    className="btn-primary mt-4 block w-full text-center"
                  >
                    {plan.cta}
                  </Link>
                )}
              </div>
            ) : (
              <p className="btn-ghost mt-8 w-full text-center">{isPremium() ? 'Downgrade disponível' : plan.cta}</p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="glass-card mx-auto max-w-3xl p-6 text-center text-sm text-slate-400">
        <strong className="text-white">Proposta de monetização:</strong> modelo freemium com plano Premium
        para instituições e alunos avançados. Receita recorrente + licenciamento B2B para escolas SENAI.
      </div>
    </div>
  );
}
