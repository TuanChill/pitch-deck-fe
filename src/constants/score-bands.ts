export type ScoreBand = {
  min: number;
  max: number;
  label: string;
  color: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
};

export const SCORE_BANDS: ScoreBand[] = [
  {
    min: 85,
    max: 100,
    label: 'Exceptional',
    color: 'emerald',
    bgColor: 'bg-emerald-500',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    borderColor: 'border-emerald-200 dark:border-emerald-800'
  },
  {
    min: 70,
    max: 84,
    label: 'Strong',
    color: 'green',
    bgColor: 'bg-green-500',
    textColor: 'text-green-600 dark:text-green-400',
    borderColor: 'border-green-200 dark:border-green-800'
  },
  {
    min: 50,
    max: 69,
    label: 'Moderate',
    color: 'yellow',
    bgColor: 'bg-yellow-500',
    textColor: 'text-yellow-600 dark:text-yellow-400',
    borderColor: 'border-yellow-200 dark:border-yellow-800'
  },
  {
    min: 0,
    max: 49,
    label: 'Weak',
    color: 'red',
    bgColor: 'bg-red-500',
    textColor: 'text-red-600 dark:text-red-400',
    borderColor: 'border-red-200 dark:border-red-800'
  }
];

export const getScoreBand = (score: number): ScoreBand => {
  return SCORE_BANDS.find((band) => score >= band.min && score <= band.max) || SCORE_BANDS[3];
};

export const getScoreColor = (score: number): string => {
  const band = getScoreBand(score);

  return band.textColor;
};

export const getScoreGradient = (score: number): { from: string; to: string } => {
  const band = getScoreBand(score);
  const gradients = {
    emerald: { from: 'from-emerald-400', to: 'to-emerald-600' },
    green: { from: 'from-green-400', to: 'to-green-600' },
    yellow: { from: 'from-yellow-400', to: 'to-yellow-600' },
    red: { from: 'from-red-400', to: 'to-red-600' }
  };

  return gradients[band.color as keyof typeof gradients];
};
