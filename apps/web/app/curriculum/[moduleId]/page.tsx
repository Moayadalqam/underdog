'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  CheckCircle2,
  Circle,
  Lock,
  Clock,
  BookOpen,
  FileText,
  Mic,
  Trophy,
  ChevronRight,
  Star,
  Target,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

// Mock module data - in production this would come from API
const modulesData: Record<string, {
  id: string;
  number: number;
  title: string;
  description: string;
  duration: string;
  lessonsCount: number;
  progress: number;
  objectives: string[];
  lessons: {
    id: string;
    title: string;
    type: 'video' | 'reading' | 'practice' | 'quiz';
    duration: string;
    completed: boolean;
    locked: boolean;
  }[];
}> = {
  '1': {
    id: '1',
    number: 1,
    title: 'Cold Calling Fundamentals',
    description: 'Master the basics of cold calling, including mindset, preparation, and the psychology behind successful outreach.',
    duration: '45 min',
    lessonsCount: 6,
    progress: 100,
    objectives: [
      'Understand the psychology of cold calling',
      'Develop a winning mindset',
      'Learn proper preparation techniques',
      'Master the basics of voice tonality',
    ],
    lessons: [
      { id: '1-1', title: 'Introduction to Cold Calling', type: 'video', duration: '8 min', completed: true, locked: false },
      { id: '1-2', title: 'The Cold Calling Mindset', type: 'reading', duration: '5 min', completed: true, locked: false },
      { id: '1-3', title: 'Pre-Call Preparation', type: 'video', duration: '10 min', completed: true, locked: false },
      { id: '1-4', title: 'Voice Tonality Basics', type: 'video', duration: '12 min', completed: true, locked: false },
      { id: '1-5', title: 'Practice: Opening Lines', type: 'practice', duration: '10 min', completed: true, locked: false },
      { id: '1-6', title: 'Module Quiz', type: 'quiz', duration: '5 min', completed: true, locked: false },
    ],
  },
  '2': {
    id: '2',
    number: 2,
    title: 'Opening the Call',
    description: 'Learn powerful opening techniques that capture attention and create immediate rapport with prospects.',
    duration: '50 min',
    lessonsCount: 7,
    progress: 60,
    objectives: [
      'Craft compelling opening statements',
      'Build instant rapport',
      'Handle initial resistance',
      'Set the tone for the conversation',
    ],
    lessons: [
      { id: '2-1', title: 'The First 10 Seconds', type: 'video', duration: '8 min', completed: true, locked: false },
      { id: '2-2', title: 'Pattern Interrupts', type: 'video', duration: '10 min', completed: true, locked: false },
      { id: '2-3', title: 'Building Rapport Quickly', type: 'reading', duration: '6 min', completed: true, locked: false },
      { id: '2-4', title: 'The Permission-Based Open', type: 'video', duration: '8 min', completed: true, locked: false },
      { id: '2-5', title: 'Practice: Opening Scripts', type: 'practice', duration: '12 min', completed: false, locked: false },
      { id: '2-6', title: 'Handling "Not Interested"', type: 'video', duration: '6 min', completed: false, locked: true },
      { id: '2-7', title: 'Module Quiz', type: 'quiz', duration: '5 min', completed: false, locked: true },
    ],
  },
  '3': {
    id: '3',
    number: 3,
    title: 'Qualifying Prospects',
    description: 'Discover how to quickly identify qualified prospects and avoid wasting time on dead-end calls.',
    duration: '55 min',
    lessonsCount: 6,
    progress: 0,
    objectives: [
      'Identify key qualification criteria',
      'Ask powerful discovery questions',
      'Recognize buying signals',
      'Disqualify efficiently and respectfully',
    ],
    lessons: [
      { id: '3-1', title: 'BANT Qualification Framework', type: 'video', duration: '10 min', completed: false, locked: false },
      { id: '3-2', title: 'Discovery Questions', type: 'reading', duration: '8 min', completed: false, locked: true },
      { id: '3-3', title: 'Active Listening Skills', type: 'video', duration: '12 min', completed: false, locked: true },
      { id: '3-4', title: 'Reading Buying Signals', type: 'video', duration: '10 min', completed: false, locked: true },
      { id: '3-5', title: 'Practice: Qualification', type: 'practice', duration: '10 min', completed: false, locked: true },
      { id: '3-6', title: 'Module Quiz', type: 'quiz', duration: '5 min', completed: false, locked: true },
    ],
  },
};

// Default module for unknown IDs
const defaultModule = {
  id: '0',
  number: 0,
  title: 'Module Not Found',
  description: 'This module could not be found.',
  duration: '0 min',
  lessonsCount: 0,
  progress: 0,
  objectives: [],
  lessons: [],
};

export default function ModuleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const moduleId = params.moduleId as string;

  const currentModule = modulesData[moduleId] || defaultModule;
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Play;
      case 'reading':
        return FileText;
      case 'practice':
        return Mic;
      case 'quiz':
        return Target;
      default:
        return BookOpen;
    }
  };

  const getLessonColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'text-cyan bg-cyan/10';
      case 'reading':
        return 'text-blue-500 bg-blue-500/10';
      case 'practice':
        return 'text-magenta bg-magenta/10';
      case 'quiz':
        return 'text-yellow-500 bg-yellow-500/10';
      default:
        return 'text-primary bg-primary/10';
    }
  };

  if (!modulesData[moduleId]) {
    return (
      <div className="min-h-screen pb-20">
        <Navbar />
        <main className="pt-28 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl font-bold mb-4">Module Not Found</h1>
            <p className="text-muted-foreground mb-8">
              The module you're looking for doesn't exist.
            </p>
            <Link href="/curriculum">
              <Button variant="gradient">
                <ArrowLeft size={18} className="mr-2" />
                Back to Curriculum
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <FadeIn>
            <Link
              href="/curriculum"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Back to Curriculum
            </Link>
          </FadeIn>

          {/* Module Header */}
          <FadeIn className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
                    Module {currentModule.number}
                  </span>
                  {currentModule.progress === 100 && (
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500 flex items-center gap-1">
                      <CheckCircle2 size={14} />
                      Completed
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                  {currentModule.title}
                </h1>
                <p className="text-lg text-muted-foreground mb-4">
                  {currentModule.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={16} />
                    {currentModule.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen size={16} />
                    {currentModule.lessonsCount} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={16} />
                    {currentModule.progress}% complete
                  </span>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="lg:w-40 flex-shrink-0">
                <GlassCard className="p-6 text-center">
                  <div className="relative w-24 h-24 mx-auto mb-3">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                      />
                      <circle
                        cx="48"
                        cy="48"
                        r="40"
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${currentModule.progress * 2.51} 251`}
                      />
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--cyan)" />
                          <stop offset="100%" stopColor="var(--magenta)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-2xl font-bold">{currentModule.progress}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Progress</p>
                </GlassCard>
              </div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Lessons List */}
            <div className="lg:col-span-2">
              <FadeIn delay={0.1}>
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Lessons</h2>
                  <StaggerContainer className="space-y-3">
                    {currentModule.lessons.map((lesson, index) => {
                      const Icon = getLessonIcon(lesson.type);
                      const colorClass = getLessonColor(lesson.type);

                      return (
                        <StaggerItem key={lesson.id}>
                          <motion.div
                            whileHover={!lesson.locked ? { scale: 1.01 } : {}}
                            className={cn(
                              'p-4 rounded-xl border transition-colors',
                              lesson.locked
                                ? 'border-border/50 bg-muted/20 opacity-60'
                                : lesson.completed
                                ? 'border-green-500/20 bg-green-500/5'
                                : 'border-border hover:border-primary/50 cursor-pointer'
                            )}
                            onClick={() => !lesson.locked && setActiveLesson(lesson.id)}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-3">
                                <div
                                  className={cn(
                                    'w-10 h-10 rounded-lg flex items-center justify-center',
                                    lesson.locked ? 'bg-muted text-muted-foreground' : colorClass
                                  )}
                                >
                                  {lesson.locked ? (
                                    <Lock size={18} />
                                  ) : (
                                    <Icon size={18} />
                                  )}
                                </div>
                                <span className="w-6 text-center text-sm text-muted-foreground">
                                  {index + 1}
                                </span>
                              </div>

                              <div className="flex-1 min-w-0">
                                <p className={cn(
                                  'font-medium truncate',
                                  lesson.locked && 'text-muted-foreground'
                                )}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <span className="capitalize">{lesson.type}</span>
                                  <span>•</span>
                                  <span>{lesson.duration}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                {lesson.completed ? (
                                  <CheckCircle2 size={20} className="text-green-500" />
                                ) : !lesson.locked && (
                                  <ChevronRight size={20} className="text-muted-foreground" />
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </StaggerItem>
                      );
                    })}
                  </StaggerContainer>
                </GlassCard>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Learning Objectives */}
              <FadeIn delay={0.2}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Lightbulb size={20} className="text-yellow-500" />
                    <h3 className="font-semibold">Learning Objectives</h3>
                  </div>
                  <ul className="space-y-3">
                    {currentModule.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm">
                        <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-primary">{index + 1}</span>
                        </div>
                        <span className="text-muted-foreground">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>

              {/* Practice Button */}
              <FadeIn delay={0.3}>
                <GlowCard glowColor="magenta" className="p-6 text-center">
                  <Mic size={32} className="mx-auto mb-3 text-magenta" />
                  <h3 className="font-semibold mb-2">Ready to Practice?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Apply what you've learned in an AI role-play session
                  </p>
                  <Link href="/roleplay">
                    <Button variant="gradient" className="w-full">
                      Start Role-Play
                    </Button>
                  </Link>
                </GlowCard>
              </FadeIn>

              {/* Tips */}
              <FadeIn delay={0.4}>
                <GlassCard className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={20} className="text-cyan" />
                    <h3 className="font-semibold">Pro Tips</h3>
                  </div>
                  <ul className="space-y-3 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-1 flex-shrink-0 text-cyan" />
                      Complete lessons in order for the best learning experience
                    </li>
                    <li className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-1 flex-shrink-0 text-cyan" />
                      Practice sessions count towards your module progress
                    </li>
                    <li className="flex items-start gap-2">
                      <MessageSquare size={14} className="mt-1 flex-shrink-0 text-cyan" />
                      Review completed lessons anytime to reinforce learning
                    </li>
                  </ul>
                </GlassCard>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
