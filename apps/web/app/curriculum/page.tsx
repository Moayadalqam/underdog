'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  Lock,
  ChevronRight,
  Trophy,
  Target,
  Zap,
  Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button, MotionButton } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

type ModuleStatus = 'completed' | 'in_progress' | 'unlocked' | 'locked';

interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  lessonsCount: number;
  scenariosCount: number;
  progress: number;
  status: ModuleStatus;
}

const statusConfig = {
  completed: {
    icon: CheckCircle2,
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
    label: 'Completed',
  },
  in_progress: {
    icon: PlayCircle,
    color: 'text-cyan',
    bgColor: 'bg-cyan/10',
    label: 'In Progress',
  },
  unlocked: {
    icon: Circle,
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    label: 'Available',
  },
  locked: {
    icon: Lock,
    color: 'text-muted-foreground/50',
    bgColor: 'bg-muted/50',
    label: 'Locked',
  },
};

export default function CurriculumPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchModules() {
      try {
        const res = await fetch('/api/curriculum');
        if (res.ok) {
          const data = await res.json();
          // Add default status and progress for now (will be dynamic with user progress later)
          const modulesWithStatus: Module[] = data.map((m: any, idx: number) => ({
            ...m,
            progress: 0,
            status: (idx < 4 ? 'unlocked' : 'locked') as ModuleStatus,
          }));
          setModules(modulesWithStatus);
        }
      } catch (error) {
        console.error('Failed to fetch modules:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchModules();
  }, []);

  const completedModules = modules.filter((m) => m.status === 'completed').length;
  const totalProgress = modules.length > 0
    ? Math.round(modules.reduce((acc, m) => acc + m.progress, 0) / modules.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <Navbar />
        <main className="pt-28 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading curriculum...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Training <span className="gradient-text">Curriculum</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Master cold calling with our 12-module program
            </p>
          </FadeIn>

          {/* Progress Overview */}
          <FadeIn delay={0.1} className="mb-10">
            <GlassCard className="p-6">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Trophy size={28} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                    <p className="text-2xl font-bold gradient-text">{totalProgress}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Modules Completed</p>
                    <p className="text-2xl font-bold">{completedModules} / 12</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-magenta/10 flex items-center justify-center">
                    <Target size={28} className="text-magenta" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Module</p>
                    <p className="text-2xl font-bold">Module 2</p>
                  </div>
                </div>
              </div>
              {/* Progress bar */}
              <div className="mt-6">
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${totalProgress}%` }}
                    transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan to-magenta"
                  />
                </div>
              </div>
            </GlassCard>
          </FadeIn>

          {/* Module Grid */}
          <StaggerContainer
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
            staggerDelay={0.05}
          >
            {modules.map((module) => {
              const config = statusConfig[module.status];
              const StatusIcon = config.icon;
              const isLocked = module.status === 'locked';

              const cardContent = (
                <motion.div
                  whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                >
                  <div
                    className={cn(
                      'relative rounded-2xl border p-6 transition-colors h-full',
                      isLocked
                        ? 'bg-card/50 border-border/50 opacity-60'
                        : 'bg-card border-border hover:border-primary/50 cursor-pointer'
                    )}
                  >
                      {/* Module number badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold',
                            module.status === 'completed'
                              ? 'bg-green-500/20 text-green-500'
                              : module.status === 'in_progress'
                              ? 'bg-cyan/20 text-cyan'
                              : 'bg-muted text-muted-foreground'
                          )}
                        >
                          {module.number}
                        </div>
                        <div className={cn('flex items-center gap-1', config.color)}>
                          <StatusIcon size={16} />
                          <span className="text-xs font-medium">{config.label}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {module.description}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <BookOpen size={12} />
                          {module.lessonsCount || 0} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          ~{(module.lessonsCount || 1) * 10} min
                        </span>
                      </div>

                      {/* Progress bar */}
                      {!isLocked && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{module.progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${module.progress}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
                              className={cn(
                                'h-full rounded-full',
                                module.status === 'completed'
                                  ? 'bg-green-500'
                                  : 'bg-gradient-to-r from-cyan to-magenta'
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {/* CTA */}
                      {module.status === 'in_progress' && (
                        <Button
                          variant="gradient"
                          size="sm"
                          className="w-full mt-4"
                        >
                          <Zap size={14} className="mr-1" />
                          Continue Learning
                        </Button>
                      )}
                      {module.status === 'unlocked' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full mt-4"
                        >
                          Start Module
                          <ChevronRight size={14} className="ml-1" />
                        </Button>
                      )}
                  </div>
                </motion.div>
              );

              return (
                <StaggerItem key={module.number}>
                  {isLocked ? (
                    cardContent
                  ) : (
                    <Link href={`/curriculum/${module.number}`}>
                      {cardContent}
                    </Link>
                  )}
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </main>
    </div>
  );
}
