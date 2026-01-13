// ===========================================
// @underdog/analytics - Performance Metrics
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

// Types
export type {
  TimePeriod,
  UserPerformance,
  DailyActivity,
  TrendPoint,
  PerformanceTrend,
  LeaderboardEntry,
  ModuleStats,
  OrganizationAnalytics,
} from './types';

// Metrics
export {
  calculateUserPerformance,
  calculateDailyActivity,
  calculateStreak,
  calculatePercentile,
} from './metrics';
