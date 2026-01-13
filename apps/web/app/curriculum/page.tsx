'use client';

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
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button, MotionButton } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

const modules = [
  {
    number: 1,
    title: 'Mindset & Preparation',
    description: 'Build the mental foundation for cold calling success',
    lessons: 5,
    duration: '45 min',
    progress: 100,
    status: 'completed' as const,
  },
  {
    number: 2,
    title: 'Opening Strong',
    description: 'Craft compelling openers that grab attention',
    lessons: 6,
    duration: '60 min',
    progress: 75,
    status: 'in_progress' as const,
  },
  {
    number: 3,
    title: 'Building Rapport',
    description: 'Connect authentically in the first 30 seconds',
    lessons: 4,
    duration: '40 min',
    progress: 0,
    status: 'unlocked' as const,
  },
  {
    number: 4,
    title: 'Discovery Questions',
    description: 'Uncover pain points with strategic questioning',
    lessons: 7,
    duration: '55 min',
    progress: 0,
    status: 'unlocked' as const,
  },
  {
    number: 5,
    title: 'Objection Handling',
    description: 'Turn "no" into "tell me more"',
    lessons: 8,
    duration: '70 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 6,
    title: 'Value Proposition',
    description: 'Articulate your offer with impact',
    lessons: 5,
    duration: '50 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 7,
    title: 'Closing Techniques',
    description: 'Secure the meeting with confidence',
    lessons: 6,
    duration: '55 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 8,
    title: 'Handling Gatekeepers',
    description: 'Navigate past assistants and receptionists',
    lessons: 4,
    duration: '35 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 9,
    title: 'Voicemail Mastery',
    description: 'Leave messages that get callbacks',
    lessons: 3,
    duration: '25 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 10,
    title: 'Follow-up Strategy',
    description: 'Persistence without being pushy',
    lessons: 5,
    duration: '45 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 11,
    title: 'Advanced Techniques',
    description: 'Pattern interrupts and psychological triggers',
    lessons: 6,
    duration: '60 min',
    progress: 0,
    status: 'locked' as const,
  },
  {
    number: 12,
    title: 'Putting It All Together',
    description: 'Full call simulations and mastery assessment',
    lessons: 4,
    duration: '90 min',
    progress: 0,
    status: 'locked' as const,
  },
];

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
  const completedModules = modules.filter((m) => m.status === 'completed').length;
  const totalProgress = Math.round(
    modules.reduce((acc, m) => acc + m.progress, 0) / modules.length
  );

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

              const CardWrapper = isLocked ? 'div' : Link;
              const cardProps = isLocked ? {} : { href: `/curriculum/${module.number}` };

              return (
                <StaggerItem key={module.number}>
                  <CardWrapper {...cardProps}>
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
                          {module.lessons} lessons
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {module.duration}
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
                  </CardWrapper>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </main>
    </div>
  );
}
