'use client';

import { SCORE_BANDS } from '@/constants/score-bands';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type GaugeChartProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  className?: string;
};

export const GaugeChart = ({
  score,
  size = 200,
  strokeWidth = 12,
  showLabel = true,
  className
}: GaugeChartProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const band = SCORE_BANDS.find((b) => score >= b.min && score <= b.max) || SCORE_BANDS[3];

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted opacity-20"
        />

        {SCORE_BANDS.map((bandInfo, i) => {
          const bandStart = (bandInfo.min / 100) * circumference;
          const bandLength = ((bandInfo.max - bandInfo.min + 1) / 100) * circumference;

          return (
            <circle
              key={i}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
              strokeDasharray={`${bandLength} ${circumference}`}
              strokeDashoffset={-bandStart}
              className={cn(bandInfo.borderColor, 'opacity-30')}
            />
          );
        }).reverse()}

        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'circOut' }}
          className={cn(band.textColor, 'drop-shadow-lg')}
          strokeLinecap="round"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={animatedScore}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-5xl font-bold tabular-nums"
        >
          {animatedScore}
        </motion.span>
        {showLabel && (
          <span className={cn('text-sm font-medium mt-1', band.textColor)}>{band.label}</span>
        )}
      </div>
    </div>
  );
};
