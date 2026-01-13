// ===========================================
// Admin Dashboard Utilities
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { UserRole } from '@underdog/core';
import type {
  DashboardStats,
  ActivityItem,
  ActivityType,
  SystemHealth,
  HealthStatus,
} from './types';
import { generateId } from '@underdog/core';

/**
 * Dashboard service interface
 */
export interface DashboardService {
  getStats(): Promise<DashboardStats>;
  getRecentActivity(limit?: number): Promise<ActivityItem[]>;
  getSystemHealth(): Promise<SystemHealth>;
  logActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<void>;
}

/**
 * In-memory dashboard service for development/testing
 */
export class InMemoryDashboardService implements DashboardService {
  private activities: ActivityItem[] = [];
  private stats: DashboardStats = {
    totalUsers: 0,
    totalOrganizations: 0,
    activeSessions: 0,
    totalSessions: 0,
    totalRecordings: 0,
    usersByRole: { admin: 0, trainer: 0, trainee: 0 },
    recentActivity: [],
  };

  async getStats(): Promise<DashboardStats> {
    return {
      ...this.stats,
      recentActivity: this.activities.slice(0, 10),
    };
  }

  async getRecentActivity(limit: number = 20): Promise<ActivityItem[]> {
    return this.activities.slice(0, limit);
  }

  async getSystemHealth(): Promise<SystemHealth> {
    // In production, this would check actual service health
    return {
      database: 'healthy',
      storage: 'healthy',
      aiEngine: 'healthy',
      voiceService: 'healthy',
      transcription: 'healthy',
      overall: 'healthy',
      checkedAt: new Date(),
    };
  }

  async logActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): Promise<void> {
    const item: ActivityItem = {
      ...activity,
      id: generateId(),
      timestamp: new Date(),
    };
    this.activities.unshift(item);

    // Keep only last 1000 activities
    if (this.activities.length > 1000) {
      this.activities = this.activities.slice(0, 1000);
    }
  }

  // Helper methods for updating stats
  updateStats(updates: Partial<Omit<DashboardStats, 'recentActivity'>>): void {
    this.stats = { ...this.stats, ...updates };
  }

  incrementStat(key: keyof Pick<DashboardStats, 'totalUsers' | 'totalOrganizations' | 'activeSessions' | 'totalSessions' | 'totalRecordings'>, amount: number = 1): void {
    this.stats[key] += amount;
  }

  incrementUsersByRole(role: UserRole, amount: number = 1): void {
    this.stats.usersByRole[role] += amount;
  }
}

/**
 * Create activity item for user events
 */
export function createUserActivity(
  type: 'user_created' | 'user_updated' | 'user_deleted',
  userId: string,
  userName: string,
  targetUserId?: string,
  targetUserName?: string
): Omit<ActivityItem, 'id' | 'timestamp'> {
  const descriptions: Record<typeof type, string> = {
    user_created: targetUserName ? `Created user ${targetUserName}` : 'User account created',
    user_updated: targetUserName ? `Updated user ${targetUserName}` : 'User account updated',
    user_deleted: targetUserName ? `Deleted user ${targetUserName}` : 'User account deleted',
  };

  return {
    type,
    userId,
    userName,
    description: descriptions[type],
    metadata: targetUserId ? { targetUserId, targetUserName } : undefined,
  };
}

/**
 * Create activity item for session events
 */
export function createSessionActivity(
  type: 'session_started' | 'session_completed',
  userId: string,
  userName: string,
  sessionId: string,
  sessionType?: string
): Omit<ActivityItem, 'id' | 'timestamp'> {
  const descriptions: Record<typeof type, string> = {
    session_started: `Started ${sessionType ?? 'training'} session`,
    session_completed: `Completed ${sessionType ?? 'training'} session`,
  };

  return {
    type,
    userId,
    userName,
    description: descriptions[type],
    metadata: { sessionId, sessionType },
  };
}

/**
 * Create activity item for recording events
 */
export function createRecordingActivity(
  type: 'recording_uploaded' | 'recording_analyzed',
  userId: string,
  userName: string,
  recordingId: string,
  filename?: string
): Omit<ActivityItem, 'id' | 'timestamp'> {
  const descriptions: Record<typeof type, string> = {
    recording_uploaded: `Uploaded recording${filename ? `: ${filename}` : ''}`,
    recording_analyzed: `Recording analysis completed${filename ? `: ${filename}` : ''}`,
  };

  return {
    type,
    userId,
    userName,
    description: descriptions[type],
    metadata: { recordingId, filename },
  };
}

/**
 * Create activity item for organization events
 */
export function createOrganizationActivity(
  type: 'organization_created' | 'organization_updated',
  userId: string,
  userName: string,
  organizationId: string,
  organizationName: string
): Omit<ActivityItem, 'id' | 'timestamp'> {
  const descriptions: Record<typeof type, string> = {
    organization_created: `Created organization ${organizationName}`,
    organization_updated: `Updated organization ${organizationName}`,
  };

  return {
    type,
    userId,
    userName,
    description: descriptions[type],
    metadata: { organizationId, organizationName },
  };
}

/**
 * Get activity type display name
 */
export function getActivityTypeDisplayName(type: ActivityType): string {
  const names: Record<ActivityType, string> = {
    user_created: 'User Created',
    user_updated: 'User Updated',
    user_deleted: 'User Deleted',
    session_started: 'Session Started',
    session_completed: 'Session Completed',
    recording_uploaded: 'Recording Uploaded',
    recording_analyzed: 'Recording Analyzed',
    organization_created: 'Organization Created',
    organization_updated: 'Organization Updated',
  };
  return names[type];
}

/**
 * Get activity type icon (for UI rendering)
 */
export function getActivityTypeIcon(type: ActivityType): string {
  const icons: Record<ActivityType, string> = {
    user_created: 'user-plus',
    user_updated: 'user-edit',
    user_deleted: 'user-minus',
    session_started: 'play',
    session_completed: 'check-circle',
    recording_uploaded: 'upload',
    recording_analyzed: 'file-search',
    organization_created: 'building-plus',
    organization_updated: 'building-edit',
  };
  return icons[type];
}

/**
 * Get health status display
 */
export function getHealthStatusDisplay(status: HealthStatus): { label: string; color: string } {
  const displays: Record<HealthStatus, { label: string; color: string }> = {
    healthy: { label: 'Healthy', color: 'green' },
    degraded: { label: 'Degraded', color: 'yellow' },
    unhealthy: { label: 'Unhealthy', color: 'red' },
    unknown: { label: 'Unknown', color: 'gray' },
  };
  return displays[status];
}

/**
 * Calculate overall health from individual services
 */
export function calculateOverallHealth(health: Omit<SystemHealth, 'overall' | 'checkedAt'>): HealthStatus {
  const statuses = Object.values(health);

  if (statuses.every(s => s === 'healthy')) {
    return 'healthy';
  }
  if (statuses.some(s => s === 'unhealthy')) {
    return 'unhealthy';
  }
  if (statuses.some(s => s === 'degraded' || s === 'unknown')) {
    return 'degraded';
  }
  return 'unknown';
}

/**
 * Format relative time for activity items
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) {
    return 'just now';
  }
  if (diffMin < 60) {
    return `${diffMin}m ago`;
  }
  if (diffHour < 24) {
    return `${diffHour}h ago`;
  }
  if (diffDay < 7) {
    return `${diffDay}d ago`;
  }
  return date.toLocaleDateString();
}
