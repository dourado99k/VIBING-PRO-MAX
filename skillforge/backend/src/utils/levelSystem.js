/** Level titles per hackathon spec */
export const LEVEL_TITLES = {
  1: 'Aprendiz',
  5: 'Operador',
  10: 'Técnico',
  20: 'Especialista',
  30: 'Mestre Industrial',
};

export function xpForLevel(level) {
  return level * 100 + (level - 1) * 50;
}

export function calculateLevel(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1) && level < 50) {
    level += 1;
  }
  return level;
}

export function getLevelTitle(level) {
  const thresholds = Object.keys(LEVEL_TITLES)
    .map(Number)
    .sort((a, b) => b - a);
  for (const t of thresholds) {
    if (level >= t) return LEVEL_TITLES[t];
  }
  return 'Aprendiz';
}

export function xpProgressInLevel(xp, level) {
  const current = xpForLevel(level);
  const next = xpForLevel(level + 1);
  const range = next - current;
  const progress = xp - current;
  return {
    current: Math.max(0, progress),
    needed: range,
    percent: Math.min(100, Math.round((progress / range) * 100)),
    xpToNext: Math.max(0, next - xp),
  };
}
