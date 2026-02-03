'use client';

import { CompetitivePosition } from '@/types/response/pitch-deck';
import { cn } from '@/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';

type PositioningMapProps = {
  positions: CompetitivePosition[];
  className?: string;
};

export const PositioningMap = ({ positions, className }: PositioningMapProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // SVG dimensions
  const width = 400;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  return (
    <div className={cn('w-full', className)}>
      <h3 className="text-lg font-semibold mb-4">Competitive Positioning</h3>

      <div className="relative" style={{ width, height }}>
        <svg width={width} height={height} className="w-full h-auto">
          {/* Grid lines */}
          {[0, 25, 50, 75, 100].map((value) => (
            <g key={value}>
              {/* Vertical */}
              <line
                x1={padding + (value / 100) * chartWidth}
                y1={padding}
                x2={padding + (value / 100) * chartWidth}
                y2={height - padding}
                stroke="currentColor"
                className="text-muted-foreground/20"
                strokeWidth={1}
              />
              {/* Horizontal */}
              <line
                x1={padding}
                y1={padding + ((100 - value) / 100) * chartHeight}
                x2={width - padding}
                y2={padding + ((100 - value) / 100) * chartHeight}
                stroke="currentColor"
                className="text-muted-foreground/20"
                strokeWidth={1}
              />
            </g>
          ))}

          {/* Axis labels */}
          <text
            x={width / 2}
            y={height - 5}
            textAnchor="middle"
            className="text-xs fill-muted-foreground"
          >
            Market Size →
          </text>
          <text
            x={10}
            y={height / 2}
            textAnchor="middle"
            transform={`rotate(-90, 10, ${height / 2})`}
            className="text-xs fill-muted-foreground"
          >
            ← Differentiation →
          </text>

          {/* Position points */}
          {positions.map((position) => {
            const x = padding + (position.x / 100) * chartWidth;
            const y = padding + ((100 - position.y) / 100) * chartHeight;
            const isHovered = hoveredId === position.id;
            const isUser = position.isUser;

            return (
              <g key={position.id}>
                {/* Outer ring for user */}
                {isUser && (
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 16 : 12}
                    fill="none"
                    stroke="currentColor"
                    className="text-primary/30"
                    strokeWidth={2}
                  />
                )}

                {/* Main point */}
                <motion.circle
                  cx={x}
                  cy={y}
                  r={isHovered ? 10 : 6}
                  fill={isUser ? 'hsl(var(--primary))' : 'currentColor'}
                  className={isUser ? '' : 'text-muted-foreground/60'}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.2 }}
                  onMouseEnter={() => setHoveredId(position.id)}
                  onMouseLeave={() => setHoveredId(null)}
                />

                {/* Tooltip */}
                {isHovered && (
                  <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <rect
                      x={x - 40}
                      y={y - 35}
                      width={80}
                      height={24}
                      rx={4}
                      fill="currentColor"
                      className="fill-foreground"
                    />
                    <text
                      x={x}
                      y={y - 19}
                      textAnchor="middle"
                      className="text-xs fill-background font-medium"
                    >
                      {position.name}
                    </text>
                  </motion.g>
                )}
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-2 right-2 flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span className="text-muted-foreground">You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-muted-foreground/60" />
            <span className="text-muted-foreground">Competitors</span>
          </div>
        </div>
      </div>
    </div>
  );
};
