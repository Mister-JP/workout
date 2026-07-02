import type { BlockSessionLog } from '../types';

const topOfRange = (repRange: string): number | null => {
  const normalized = repRange.replace(/\s/g, '');
  const matches = normalized.match(/(\d+)(?:-(\d+))?/);
  if (!matches) return null;
  return Number(matches[2] ?? matches[1]);
};

export const getProgressionSuggestion = (
  block: { sets: number; repRange: string },
  log: BlockSessionLog,
): string => {
  const targetTop = topOfRange(block.repRange);
  if (!targetTop || log.skipped || log.sets.length < block.sets) return '';

  const allAtTop = log.sets.slice(0, block.sets).every((set) => set.reps >= targetTop);
  if (!allAtTop) return '';

  return `You reached the top of your ${block.repRange} rep target for all ${block.sets} sets. Consider the smallest available weight increase next time.`;
};
