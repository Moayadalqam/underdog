'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  RotateCcw,
  Download,
  Share2,
  Clock,
  Calendar,
  Star,
  Trophy,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Lightbulb,
  Target,
  ThumbsUp,
  User,
  Building2,
  Mic,
  Volume2,
  Award,
  Zap,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard, GlowCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

// Mock session result data
const mockSessionResult = {
  id: '1',
  date: 'January 13, 2024',
  duration: '4:32',
  scenario: 'Quick Practice',
  persona: {
    name: 'Skeptical Steve',
    company: 'Acme Corporation',
    difficulty: 'Hard',
  },
  overallScore: 82,
  outcome: 'Meeting Booked',
  transcript: [
    { time: '0:00', speaker: 'You', text: "Hi, is this Steve? This is John from Underdog Sales." },
    { time: '0:05', speaker: 'AI', text: "Yeah, this is Steve. Look, I'm really busy right now, what's this about?" },
    { time: '0:12', speaker: 'You', text: "I totally understand you're busy. I'll keep this brief - I noticed Acme has been expanding rapidly, and I wanted to share something that's helped similar companies cut their sales cycle time by 40%." },
    { time: '0:28', speaker: 'AI', text: "40%? That sounds too good to be true. What are you selling?" },
    { time: '0:35', speaker: 'You', text: "Fair question. We provide AI-powered sales training that helps teams like yours practice and improve their cold calling skills. But honestly, I'm not trying to sell you anything today - I just wanted to see if it makes sense to have a quick 15-minute conversation about your current sales challenges." },
    { time: '0:55', speaker: 'AI', text: "Hmm, we do have some challenges with onboarding new reps. They take forever to get up to speed." },
    { time: '1:05', speaker: 'You', text: "That's actually one of the most common pain points we hear. How long does it typically take your new reps to become productive?" },
    { time: '1:15', speaker: 'AI', text: "Usually about 3-4 months before they're hitting quota consistently." },
    { time: '1:22', speaker: 'You', text: "What if I told you we've helped companies cut that down to 6 weeks? Would it be worth 15 minutes next week to show you how?" },
    { time: '1:35', speaker: 'AI', text: "Alright, you've got my attention. Send me a calendar invite for Thursday afternoon." },
    { time: '1:42', speaker: 'You', text: "Perfect! I'll send that over right now. Thanks for your time, Steve. Talk soon!" },
  ],
  metrics: {
    talkRatio: 58,
    questionsAsked: 3,
    objectionHandling: 88,
    rapport: 75,
    valueProposition: 85,
    closingSkill: 92,
    pace: 80,
    clarity: 85,
  },
  feedback: {
    strengths: [
      'Excellent acknowledgment of the prospect\'s time constraint',
      'Strong pivot from objection to value proposition',
      'Good use of specific stats to build credibility',
      'Successfully secured the meeting with a clear next step',
      'Natural conversational flow throughout the call',
    ],
    improvements: [
      'Consider asking more discovery questions before pitching',
      'Could have explored the onboarding pain point deeper',
      'Try to quantify the cost of their current problem',
      'Practice transitioning more smoothly between topics',
    ],
    aiSuggestion: 'Great job handling the initial resistance! For your next call, try asking one more discovery question before moving to your value proposition. This will help you tailor your pitch more specifically to their situation.',
  },
  badges: [
    { id: 'first-meeting', name: 'Meeting Setter', description: 'Booked your first meeting' },
    { id: 'objection-master', name: 'Objection Handler', description: 'Successfully handled 3+ objections' },
  ],
};

export default function SessionResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [expandedTranscript, setExpandedTranscript] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-500';
    if (score >= 70) return 'text-cyan';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getScoreBg = (score: number) => {
    if (score >= 85) return 'bg-green-500';
    if (score >= 70) return 'bg-cyan';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <FadeIn>
            <Link
              href="/roleplay"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Back to Role-Play
            </Link>
          </FadeIn>

          {/* Header */}
          <FadeIn className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-500/10 text-green-500">
                    {mockSessionResult.outcome}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-muted text-muted-foreground">
                    {mockSessionResult.scenario}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Session with {mockSessionResult.persona.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 size={14} />
                    {mockSessionResult.persona.company}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {mockSessionResult.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {mockSessionResult.date}
                  </span>
                  <span className={cn(
                    'flex items-center gap-1',
                    mockSessionResult.persona.difficulty === 'Easy' && 'text-green-500',
                    mockSessionResult.persona.difficulty === 'Medium' && 'text-yellow-500',
                    mockSessionResult.persona.difficulty === 'Hard' && 'text-red-500'
                  )}>
                    <Target size={14} />
                    {mockSessionResult.persona.difficulty} Difficulty
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link href="/roleplay">
                  <Button variant="gradient">
                    <RotateCcw size={16} className="mr-2" />
                    Practice Again
                  </Button>
                </Link>
                <Button variant="outline" size="icon">
                  <Share2 size={16} />
                </Button>
                <Button variant="outline" size="icon">
                  <Download size={16} />
                </Button>
              </div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Score Overview */}
              <FadeIn delay={0.1}>
                <GlowCard glowColor="cyan" className="p-6">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Score Ring */}
                    <div className="relative w-32 h-32 flex-shrink-0">
                      <svg className="w-full h-full -rotate-90">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="10"
                          className="text-muted/20"
                        />
                        <motion.circle
                          cx="64"
                          cy="64"
                          r="56"
                          fill="none"
                          stroke="url(#scoreGradient)"
                          strokeWidth="10"
                          strokeLinecap="round"
                          initial={{ strokeDasharray: '0 352' }}
                          animate={{ strokeDasharray: `${mockSessionResult.overallScore * 3.52} 352` }}
                          transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                        <defs>
                          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="var(--cyan)" />
                            <stop offset="100%" stopColor="var(--magenta)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <Trophy size={20} className="text-yellow-500 mb-1" />
                        <motion.span
                          className="text-4xl font-bold"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          {mockSessionResult.overallScore}
                        </motion.span>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="flex-1 text-center sm:text-left">
                      <h2 className="text-2xl font-bold mb-2">Excellent Performance!</h2>
                      <p className="text-muted-foreground mb-4">
                        You successfully booked a meeting with a hard prospect. Your objection handling was particularly strong.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {mockSessionResult.badges.map((badge) => (
                          <motion.div
                            key={badge.id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, delay: 1 }}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-500 text-sm"
                          >
                            <Award size={14} />
                            {badge.name}
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                </GlowCard>
              </FadeIn>

              {/* Transcript */}
              <FadeIn delay={0.2}>
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare size={20} />
                      Call Transcript
                    </h2>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <Play size={14} className="mr-1" />
                        Replay
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedTranscript(!expandedTranscript)}
                      >
                        {expandedTranscript ? 'Show Less' : 'Show All'}
                      </Button>
                    </div>
                  </div>

                  <div className={cn(
                    'space-y-3 overflow-hidden transition-all duration-300',
                    expandedTranscript ? 'max-h-none' : 'max-h-80'
                  )}>
                    {mockSessionResult.transcript.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: entry.speaker === 'You' ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className={cn(
                          'p-3 rounded-xl',
                          entry.speaker === 'You'
                            ? 'bg-cyan/10 ml-8'
                            : 'bg-magenta/10 mr-8'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                            entry.speaker === 'You'
                              ? 'bg-cyan/20'
                              : 'bg-magenta/20'
                          )}>
                            {entry.speaker === 'You' ? (
                              <Mic size={14} className="text-cyan" />
                            ) : (
                              <User size={14} className="text-magenta" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={cn(
                                'text-xs font-medium',
                                entry.speaker === 'You' ? 'text-cyan' : 'text-magenta'
                              )}>
                                {entry.speaker}
                              </span>
                              <span className="text-xs text-muted-foreground font-mono">
                                {entry.time}
                              </span>
                            </div>
                            <p className="text-sm">{entry.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {!expandedTranscript && (
                    <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-card to-transparent pointer-events-none" />
                  )}
                </GlassCard>
              </FadeIn>

              {/* AI Coaching */}
              <FadeIn delay={0.3}>
                <GlowCard glowColor="magenta" className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-magenta/20 flex items-center justify-center">
                      <Zap size={20} className="text-magenta" />
                    </div>
                    <h2 className="text-lg font-semibold">AI Coaching Insight</h2>
                  </div>
                  <p className="text-muted-foreground">
                    {mockSessionResult.feedback.aiSuggestion}
                  </p>
                </GlowCard>
              </FadeIn>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Metrics */}
              <FadeIn delay={0.4}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Performance Metrics
                  </h3>
                  <div className="space-y-4">
                    {Object.entries(mockSessionResult.metrics).map(([key, value], index) => {
                      const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                      return (
                        <div key={key}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{label}</span>
                            <span className={cn('font-medium', getScoreColor(value))}>{value}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${value}%` }}
                              transition={{ duration: 0.8, ease: 'easeOut', delay: 0.5 + index * 0.1 }}
                              className={cn('h-full rounded-full', getScoreBg(value))}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>
              </FadeIn>

              {/* Strengths */}
              <FadeIn delay={0.5}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-500">
                    <ThumbsUp size={18} />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {mockSessionResult.feedback.strengths.map((strength, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{strength}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>

              {/* Areas to Improve */}
              <FadeIn delay={0.6}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-yellow-500">
                    <Lightbulb size={18} />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {mockSessionResult.feedback.improvements.map((improvement, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                        className="flex items-start gap-2 text-sm"
                      >
                        <Target size={14} className="text-yellow-500 mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{improvement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>

              {/* Next Steps */}
              <FadeIn delay={0.7}>
                <GlowCard glowColor="cyan" className="p-6 text-center">
                  <Trophy size={32} className="mx-auto mb-3 text-cyan" />
                  <h3 className="font-semibold mb-2">Ready for More?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Practice makes perfect. Try another session to keep improving.
                  </p>
                  <Link href="/roleplay" className="block">
                    <Button variant="gradient" className="w-full">
                      Start New Session
                    </Button>
                  </Link>
                </GlowCard>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
