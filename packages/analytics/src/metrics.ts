// ===========================================
// Metrics Calculations
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { UserPerformance, DailyActivity, TimePeriod } from './types';

/**
 * Calculate user performance metrics
 */
export function calculateUserPerformance(
  userId: string,
  sessions: SessionData[],
  period: TimePeriod
): UserPerformance {
  const filtered = filterByPeriod(sessions, period);

  if (filtered.length === 0) {
    return {
      userId,
      period,
      totalSessions: 0,
      totalMinutes: 0,
      averageScore: 0,
      scoresByCategory: { opening: 0, discovery: 0, objectionHandling: 0, closing: 0 },
      improvement: 0,
    };
  }

  const totalSessions = filtered.length;
  const totalMinutes = filtered.reduce((sum, s) => sum + (s.durationMinutes ?? 0), 0);
  const averageScore = filtered.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / totalSessions;

  // Calculate category averages
  const categoryScores = {
    opening: 0,
    discovery: 0,
    objectionHandling: 0,
    closing: 0,
  };

  for (const session of filtered) {
    if (session.scores) {
      categoryScores.opening += session.scores.opening ?? 0;
      categoryScores.discovery += session.scores.discovery ?? 0;
      categoryScores.objectionHandling += session.scores.objectionHandling ?? 0;
      categoryScores.closing += session.scores.closing ?? 0;
    }
  }

  for (const key of Object.keys(categoryScores) as Array<keyof typeof categoryScores>) {
    categoryScores[key] = Math.round(categoryScores[key] / totalSessions);
  }

  // Calculate improvement (compare to previous period)
  const previousPeriod = getPreviousPeriod(period);
  const previousSessions = filterByPeriod(sessions, previousPeriod);
  const previousAverage = previousSessions.length > 0
    ? previousSessions.reduce((sum, s) => sum + (s.overallScore ?? 0), 0) / previousSessions.length
    : averageScore;

  const improvement = previousAverage > 0
    ? Math.round(((averageScore - previousAverage) / previousAverage) * 100)
    : 0;

  return {
    userId,
    period,
    totalSessions,
    totalMinutes: Math.round(totalMinutes),
    averageScore: Math.round(averageScore),
    scoresByCategory: categoryScores,
    improvement,
  };
}

/**
 * Calculate daily activity
 */
export function calculateDailyActivity(
  sessions: SessionData[],
  days: number = 30
): DailyActivity[] {
  const activity: Map<string, DailyActivity> = new Map();

  // Initialize all days
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    activity.set(dateStr, {
      date: dateStr,
      sessions: 0,
      minutes: 0,
      averageScore: 0,
    });
  }

  // Aggregate sessions
  for (const session of sessions) {
    const dateStr = new Date(session.startedAt).toISOString().split('T')[0];
    const existing = activity.get(dateStr);
    if (existing) {
      existing.sessions++;
      existing.minutes += session.durationMinutes ?? 0;
      // Running average
      existing.averageScore =
        (existing.averageScore * (existing.sessions - 1) + (session.overallScore ?? 0)) /
        existing.sessions;
    }
  }

  return Array.from(activity.values()).sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * Calculate streak (consecutive days with activity)
 */
export function calculateStreak(dailyActivity: DailyActivity[]): number {
  let streak = 0;
  const sorted = [...dailyActivity].sort((a, b) => b.date.localeCompare(a.date));

  for (const day of sorted) {
    if (day.sessions > 0) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Calculate percentile rank
 */
export function calculatePercentile(score: number, allScores: number[]): number {
  if (allScores.length === 0) return 0;

  const sorted = [...allScores].sort((a, b) => a - b);
  const belowCount = sorted.filter(s => s < score).length;

  return Math.round((belowCount / sorted.length) * 100);
}

// Helper types and functions

interface SessionData {
  sessionId: string;
  startedAt: Date;
  durationMinutes?: number;
  overallScore?: number;
  scores?: {
    opening?: number;
    discovery?: number;
    objectionHandling?: number;
    closing?: number;
  };
}

function filterByPeriod(sessions: SessionData[], period: TimePeriod): SessionData[] {
  const now = new Date();
  let cutoff: Date;

  switch (period) {
    case 'day':
      cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'quarter':
      cutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      cutoff = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      return sessions;
  }

  return sessions.filter(s => new Date(s.startedAt) >= cutoff);
}

function getPreviousPeriod(period: TimePeriod): TimePeriod {
  // For comparison, use the same period length
  return period;
}
