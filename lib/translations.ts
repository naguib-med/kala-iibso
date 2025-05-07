export const CONDITIONS = {
  NEW: 'Neuf',
  LIKE_NEW: 'Comme neuf',
  GOOD: 'Bon état',
  FAIR: 'État moyen',
  POOR: 'À rénover',
} as const;

export const getConditionLabel = (condition: keyof typeof CONDITIONS) => {
  return CONDITIONS[condition];
};
