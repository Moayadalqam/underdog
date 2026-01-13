// ===========================================
// Analytics Types
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

/**
 * Time period for analytics
 */
export type TimePeriod = 'day' | 'week' | 'month' | 'quarter' | 'year' | 'all';

/**
 * User performance summary
 */
export interface UserPerformance {
  userId: string;
  period: TimePeriod;
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  scoresByCategory: {
    opening: number;
    discovery: number;
    objectionHandling: number;
    closing: number;
  };
  improvement: number; // Percentage change from previous period
  rank?: number; // Rank among peers
}

/**
 * Daily activity record
 */
export interface DailyActivity {
  date: string; // YYYY-MM-DD
  sessions: number;
  minutes: number;
  averageScore: number;
}

/**
 * Trend data point
 */
export interface TrendPoint {
  date: string;
  value: number;
}

/**
 * Performance trend
 */
export interface PerformanceTrend {
  metric: string;
  data: TrendPoint[];
  change: number; // Percentage change over period
  direction: 'up' | 'down' | 'stable';
}

/**
 * Leaderboard entry
 */
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  sessions: number;
  change: number; // Position change from previous period
}

/**
 * Module completion stats
 */
export interface ModuleStats {
  moduleId: string;
  moduleNumber: number;
  totalUsers: number;
  completedUsers: number;
  averageScore: number;
  averageTimeMinutes: number;
}

/**
 * Organization analytics
 */
export interface OrganizationAnalytics {
  organizationId: string;
  period: TimePeriod;
  activeUsers: number;
  totalSessions: number;
  totalMinutes: number;
  averageScore: number;
  topPerformers: LeaderboardEntry[];
  moduleProgress: ModuleStats[];
}
