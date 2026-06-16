/** Optional sound effects via Web Audio API */
export function useSound() {
  const play = (frequency = 440, duration = 0.1) => {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = frequency;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      /* silent fail */
    }
  };

  return {
    xp: () => play(523, 0.15),
    levelUp: () => {
      play(523, 0.1);
      setTimeout(() => play(659, 0.1), 100);
      setTimeout(() => play(784, 0.2), 200);
    },
  };
}
