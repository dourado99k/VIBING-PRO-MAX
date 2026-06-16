export const LEVEL_TITLES = {
  1: 'Aprendiz',
  5: 'Operador',
  10: 'Técnico',
  20: 'Especialista',
  30: 'Mestre Industrial',
};

export function getLevelTitle(level) {
  const keys = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const k of keys) {
    if (level >= k) return LEVEL_TITLES[k];
  }
  return 'Aprendiz';
}

export const DIFFICULTY_LABELS = {
  EASY: { label: 'Fácil', color: 'text-green-400', bg: 'bg-green-500/20' },
  MEDIUM: { label: 'Médio', color: 'text-yellow-400', bg: 'bg-yellow-500/20' },
  HARD: { label: 'Difícil', color: 'text-orange-400', bg: 'bg-orange-500/20' },
  BOSS: { label: 'Boss', color: 'text-red-400', bg: 'bg-red-500/20' },
};

export const CATEGORY_LABELS = {
  FRONTEND: 'Frontend',
  BACKEND: 'Backend',
  DATABASE: 'Banco de Dados',
  SOFT_SKILLS: 'Soft Skills',
  DEVOPS: 'DevOps',
  CUSTOM: 'Personalizado',
};
