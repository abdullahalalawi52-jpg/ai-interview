export function getScoreColorClass(score: number, type: 'text' | 'bg' = 'text'): string {
  if (type === 'text') {
    return score >= 80 ? 'text-green-500' : score >= 50 ? 'text-yellow-500' : 'text-error';
  }
  return score >= 80 ? 'bg-green-500/10 text-green-600 border-green-500/20' : 
         score >= 50 ? 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20' : 
         'bg-error/10 text-error border-error/20';
}
