/**
 * Score formatting utilities for consistent decimal display
 */

/**
 * Format score to 1 decimal place
 * @param score - Raw score value
 * @returns Formatted string with 1 decimal (e.g., "8.8")
 */
export const formatScore = (score: number): string => {
  return score.toFixed(1);
};

/**
 * Format score percentage to 1 decimal place
 * @param value - Raw decimal value (0-1)
 * @returns Formatted string with 1 decimal (e.g., "25.5")
 */
export const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(1);
};

/**
 * Round score to 1 decimal place (returns number for calculations/animations)
 * @param score - Raw score value
 * @returns Number rounded to 1 decimal (e.g., 8.76 → 8.8)
 */
export const roundScore = (score: number): number => {
  return Math.round(score * 10) / 10;
};
