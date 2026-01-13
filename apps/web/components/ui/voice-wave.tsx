'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoiceWaveProps {
  isActive?: boolean;
  barCount?: number;
  className?: string;
  color?: 'cyan' | 'magenta' | 'gradient';
}

export function VoiceWave({
  isActive = false,
  barCount = 5,
  className,
  color = 'cyan',
}: VoiceWaveProps) {
  const colorClasses = {
    cyan: 'bg-[hsl(var(--cyan))]',
    magenta: 'bg-[hsl(var(--magenta))]',
    gradient: 'bg-gradient-to-t from-[hsl(var(--cyan))] to-[hsl(var(--magenta))]',
  };

  return (
    <div className={cn('flex items-center justify-center gap-1', className)}>
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className={cn('w-1 rounded-full', colorClasses[color])}
          animate={
            isActive
              ? {
                  height: [12, 24 + Math.random() * 16, 12],
                  opacity: [0.5, 1, 0.5],
                }
              : { height: 12, opacity: 0.3 }
          }
          transition={
            isActive
              ? {
                  duration: 0.5 + Math.random() * 0.3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.1,
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
}

// Circular voice indicator
export function VoiceOrb({
  isActive = false,
  size = 'md',
  className,
}: {
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };

  return (
    <div className={cn('relative', sizeClasses[size], className)}>
      {/* Glow rings */}
      {isActive && (
        <>
          <motion.div
            className="absolute inset-0 rounded-full bg-[hsl(var(--cyan))]"
            animate={{ scale: [1, 1.5], opacity: [0.3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />
          <motion.div
            className="absolute inset-0 rounded-full bg-[hsl(var(--cyan))]"
            animate={{ scale: [1, 1.8], opacity: [0.2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
          />
        </>
      )}
      {/* Main orb */}
      <motion.div
        className={cn(
          'absolute inset-0 rounded-full',
          'bg-gradient-to-br from-[hsl(var(--cyan))] to-[hsl(var(--magenta))]',
          isActive && 'glow-cyan'
        )}
        animate={
          isActive
            ? { scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }
            : { scale: 1, opacity: 0.6 }
        }
        transition={
          isActive
            ? { duration: 1, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.3 }
        }
      />
      {/* Inner glow */}
      <div className="absolute inset-2 rounded-full bg-gradient-to-br from-white/30 to-transparent" />
    </div>
  );
}
