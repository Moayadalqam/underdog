'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { type ReactNode } from 'react';

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: 'cyan' | 'magenta' | 'gradient';
  hoverEffect?: boolean;
  onClick?: () => void;
}

export function GlowCard({
  children,
  className,
  glowColor = 'cyan',
  hoverEffect = true,
  onClick,
}: GlowCardProps) {
  const glowClasses = {
    cyan: 'before:bg-[hsl(var(--cyan))]',
    magenta: 'before:bg-[hsl(var(--magenta))]',
    gradient: 'before:bg-gradient-to-r before:from-[hsl(var(--cyan))] before:to-[hsl(var(--magenta))]',
  };

  const card = (
    <div
      className={cn(
        'relative rounded-2xl p-[1px] overflow-hidden group',
        'before:absolute before:inset-0 before:opacity-0 before:transition-opacity before:duration-500',
        'hover:before:opacity-100',
        glowClasses[glowColor],
        className
      )}
    >
      {/* Animated gradient border on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--cyan))] via-[hsl(var(--magenta))] to-[hsl(var(--cyan))] animate-spin-slow rounded-2xl" />
      </div>
      {/* Card content */}
      <div className="relative rounded-2xl bg-card p-6 h-full backdrop-blur-xl">
        {children}
      </div>
    </div>
  );

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={onClick ? { scale: 0.98 } : undefined}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        onClick={onClick}
        style={onClick ? { cursor: 'pointer' } : undefined}
      >
        {card}
      </motion.div>
    );
  }

  return onClick ? <div onClick={onClick} style={{ cursor: 'pointer' }}>{card}</div> : card;
}

// Glass card variant
export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className={cn(
        'relative rounded-2xl overflow-hidden',
        'backdrop-blur-xl bg-white/5 border border-white/10',
        'shadow-xl shadow-black/5',
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Stat card with animated number
export function StatCard({
  value,
  label,
  icon,
  trend,
  className,
}: {
  value: string | number;
  label: string;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  className?: string;
}) {
  return (
    <GlassCard className={cn('p-6', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold mt-1 gradient-text"
          >
            {value}
          </motion.p>
          {trend && (
            <p
              className={cn(
                'text-sm mt-2',
                trend.positive ? 'text-green-500' : 'text-red-500'
              )}
            >
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        {icon && (
          <div className="p-3 rounded-xl bg-primary/10 text-primary">{icon}</div>
        )}
      </div>
    </GlassCard>
  );
}
