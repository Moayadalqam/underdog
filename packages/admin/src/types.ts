// ===========================================
// Admin Types
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { User, UserRole, Organization, TrainingSession, Recording } from '@underdog/core';

/**
 * User with extended admin details
 */
export interface UserWithDetails extends User {
  organization?: Organization;
  sessionCount: number;
  lastActiveAt?: Date;
}

/**
 * Organization with statistics
 */
export interface OrganizationWithStats extends Organization {
  userCount: number;
  activeSessionCount: number;
  totalSessions: number;
}

/**
 * User creation input
 */
export interface CreateUserInput {
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  password?: string; // Optional for SSO
}

/**
 * User update input
 */
export interface UpdateUserInput {
  name?: string;
  role?: UserRole;
  organizationId?: string;
}

/**
 * Organization creation input
 */
export interface CreateOrganizationInput {
  name: string;
}

/**
 * Organization update input
 */
export interface UpdateOrganizationInput {
  name?: string;
}

/**
 * Pagination options
 */
export interface PaginationOptions {
  page: number;
  pageSize: number;
}

/**
 * Paginated result
 */
export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * User filter options
 */
export interface UserFilters {
  search?: string;
  role?: UserRole;
  organizationId?: string;
  isActive?: boolean;
}

/**
 * Organization filter options
 */
export interface OrganizationFilters {
  search?: string;
}

/**
 * Admin dashboard stats
 */
export interface DashboardStats {
  totalUsers: number;
  totalOrganizations: number;
  activeSessions: number;
  totalSessions: number;
  totalRecordings: number;
  usersByRole: Record<UserRole, number>;
  recentActivity: ActivityItem[];
}

/**
 * Activity log item
 */
export interface ActivityItem {
  id: string;
  type: ActivityType;
  userId: string;
  userName: string;
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

/**
 * Activity types
 */
export type ActivityType =
  | 'user_created'
  | 'user_updated'
  | 'user_deleted'
  | 'session_started'
  | 'session_completed'
  | 'recording_uploaded'
  | 'recording_analyzed'
  | 'organization_created'
  | 'organization_updated';

/**
 * Permission check result
 */
export interface PermissionCheck {
  allowed: boolean;
  reason?: string;
}

/**
 * Bulk operation result
 */
export interface BulkOperationResult {
  successful: string[];
  failed: { id: string; error: string }[];
}

/**
 * System health status
 */
export interface SystemHealth {
  database: HealthStatus;
  storage: HealthStatus;
  aiEngine: HealthStatus;
  voiceService: HealthStatus;
  transcription: HealthStatus;
  overall: HealthStatus;
  checkedAt: Date;
}

export type HealthStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
