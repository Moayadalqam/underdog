'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  Flame,
  Award,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

type Trend = 'up' | 'down' | 'neutral';

const stats: {
  title: string;
  value: string;
  change: string;
  trend: Trend;
  icon: typeof Activity;
  color: string;
}[] = [
  {
    title: 'Total Sessions',
    value: '47',
    change: '+12%',
    trend: 'up',
    icon: Activity,
    color: 'cyan',
  },
  {
    title: 'Average Score',
    value: '78%',
    change: '+5%',
    trend: 'up',
    icon: Target,
    color: 'green',
  },
  {
    title: 'Practice Time',
    value: '12.5h',
    change: '+2.3h',
    trend: 'up',
    icon: Clock,
    color: 'magenta',
  },
  {
    title: 'Current Streak',
    value: '7 days',
    change: 'Best: 14',
    trend: 'neutral',
    icon: Flame,
    color: 'orange',
  },
];

const skillScores = [
  { label: 'Opening', score: 85, prevScore: 78, color: 'cyan' },
  { label: 'Discovery', score: 72, prevScore: 68, color: 'blue' },
  { label: 'Objection Handling', score: 68, prevScore: 72, color: 'magenta' },
  { label: 'Value Proposition', score: 81, prevScore: 75, color: 'purple' },
  { label: 'Closing', score: 75, prevScore: 70, color: 'green' },
];

const recentSessions = [
  {
    date: 'Today',
    time: '2:30 PM',
    duration: '15 min',
    score: 82,
    persona: 'Skeptical Steve',
  },
  {
    date: 'Today',
    time: '10:15 AM',
    duration: '12 min',
    score: 78,
    persona: 'Busy Barbara',
  },
  {
    date: 'Yesterday',
    time: '4:45 PM',
    duration: '18 min',
    score: 85,
    persona: 'Friendly Frank',
  },
  {
    date: 'Yesterday',
    time: '11:00 AM',
    duration: '10 min',
    score: 71,
    persona: 'Gatekeeper Gary',
  },
];

const weeklyData = [
  { day: 'Mon', sessions: 3, score: 72 },
  { day: 'Tue', sessions: 2, score: 75 },
  { day: 'Wed', sessions: 4, score: 78 },
  { day: 'Thu', sessions: 2, score: 80 },
  { day: 'Fri', sessions: 5, score: 82 },
  { day: 'Sat', sessions: 1, score: 79 },
  { day: 'Sun', sessions: 3, score: 85 },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Performance <span className="gradient-text">Analytics</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Track your progress and identify areas for improvement
              </p>
            </div>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                >
                  {range === 'week' ? 'This Week' : range === 'month' ? 'Month' : 'All Time'}
                </Button>
              ))}
            </div>
          </FadeIn>

          {/* Stats Grid */}
          <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {stats.map((stat) => (
              <StaggerItem key={stat.title}>
                <GlassCard className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                      <div
                        className={cn(
                          'flex items-center gap-1 mt-2 text-sm',
                          stat.trend === 'up' && 'text-green-500',
                          stat.trend === 'down' && 'text-red-500',
                          stat.trend === 'neutral' && 'text-muted-foreground'
                        )}
                      >
                        {stat.trend === 'up' && <ArrowUpRight size={14} />}
                        {stat.trend === 'down' && <ArrowDownRight size={14} />}
                        {stat.change}
                      </div>
                    </div>
                    <div
                      className={cn(
                        'p-3 rounded-xl',
                        stat.color === 'cyan' && 'bg-cyan/10 text-cyan',
                        stat.color === 'green' && 'bg-green-500/10 text-green-500',
                        stat.color === 'magenta' && 'bg-magenta/10 text-magenta',
                        stat.color === 'orange' && 'bg-orange-500/10 text-orange-500'
                      )}
                    >
                      <stat.icon size={24} />
                    </div>
                  </div>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>

          {/* Main Charts */}
          <div className="grid gap-6 lg:grid-cols-3 mb-8">
            {/* Weekly Progress Chart */}
            <FadeIn delay={0.2} className="lg:col-span-2">
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Weekly Progress</h3>
                    <p className="text-sm text-muted-foreground">Sessions and scores this week</p>
                  </div>
                  <BarChart3 size={20} className="text-muted-foreground" />
                </div>
                <div className="flex items-end justify-between gap-2 h-48">
                  {weeklyData.map((day, index) => (
                    <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${day.score}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="w-full max-w-12 rounded-t-lg bg-gradient-to-t from-cyan to-magenta relative group"
                      >
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-popover px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          {day.score}% · {day.sessions} sessions
                        </div>
                      </motion.div>
                      <span className="text-xs text-muted-foreground">{day.day}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>

            {/* Skill Distribution */}
            <FadeIn delay={0.3}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Skill Breakdown</h3>
                    <p className="text-sm text-muted-foreground">Performance by category</p>
                  </div>
                  <PieChart size={20} className="text-muted-foreground" />
                </div>
                <div className="space-y-4">
                  {skillScores.map((skill, index) => {
                    const trend = skill.score - skill.prevScore;
                    return (
                      <div key={skill.label}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span>{skill.label}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{skill.score}%</span>
                            <span
                              className={cn(
                                'text-xs',
                                trend > 0 && 'text-green-500',
                                trend < 0 && 'text-red-500',
                                trend === 0 && 'text-muted-foreground'
                              )}
                            >
                              {trend > 0 ? '+' : ''}{trend}%
                            </span>
                          </div>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${skill.score}%` }}
                            transition={{ duration: 0.8, delay: index * 0.1 }}
                            className={cn(
                              'h-full rounded-full',
                              skill.color === 'cyan' && 'bg-cyan',
                              skill.color === 'blue' && 'bg-blue-500',
                              skill.color === 'magenta' && 'bg-magenta',
                              skill.color === 'purple' && 'bg-purple-500',
                              skill.color === 'green' && 'bg-green-500'
                            )}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </FadeIn>
          </div>

          {/* Recent Sessions & Achievements */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Recent Sessions */}
            <FadeIn delay={0.4}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Recent Sessions</h3>
                    <p className="text-sm text-muted-foreground">Your latest training activities</p>
                  </div>
                  <Calendar size={20} className="text-muted-foreground" />
                </div>
                <div className="space-y-3">
                  {recentSessions.map((session, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold',
                            session.score >= 80
                              ? 'bg-green-500/20 text-green-500'
                              : session.score >= 70
                              ? 'bg-cyan/20 text-cyan'
                              : 'bg-orange-500/20 text-orange-500'
                          )}
                        >
                          {session.score}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{session.persona}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.date} · {session.time} · {session.duration}
                          </p>
                        </div>
                      </div>
                      <TrendingUp
                        size={16}
                        className={cn(
                          session.score >= 80 ? 'text-green-500' : 'text-muted-foreground'
                        )}
                      />
                    </motion.div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All Sessions
                </Button>
              </GlassCard>
            </FadeIn>

            {/* Achievements */}
            <FadeIn delay={0.5}>
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold">Achievements</h3>
                    <p className="text-sm text-muted-foreground">Your earned badges</p>
                  </div>
                  <Award size={20} className="text-muted-foreground" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { name: 'First Call', icon: '🎯', earned: true },
                    { name: '7 Day Streak', icon: '🔥', earned: true },
                    { name: 'Score 80+', icon: '⭐', earned: true },
                    { name: '10 Sessions', icon: '📈', earned: true },
                    { name: 'Module Master', icon: '🏆', earned: false },
                    { name: 'Perfect Score', icon: '💎', earned: false },
                  ].map((achievement, index) => (
                    <motion.div
                      key={achievement.name}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      className={cn(
                        'flex flex-col items-center p-4 rounded-xl text-center transition-colors',
                        achievement.earned
                          ? 'bg-primary/10'
                          : 'bg-muted/30 opacity-50'
                      )}
                    >
                      <span className="text-3xl mb-2">{achievement.icon}</span>
                      <span className="text-xs font-medium">{achievement.name}</span>
                    </motion.div>
                  ))}
                </div>
              </GlassCard>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
