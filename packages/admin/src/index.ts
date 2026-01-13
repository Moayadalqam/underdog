// ===========================================
// @underdog/admin - Admin Console Utilities
// ===========================================
// Owner: Stream 6 (Admin Console)

// Types
export type {
  UserWithDetails,
  OrganizationWithStats,
  CreateUserInput,
  UpdateUserInput,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  PaginationOptions,
  PaginatedResult,
  UserFilters,
  OrganizationFilters,
  DashboardStats,
  ActivityItem,
  ActivityType,
  PermissionCheck,
  BulkOperationResult,
  SystemHealth,
  HealthStatus,
} from './types';

// Users
export type { UserService } from './users';
export {
  InMemoryUserService,
  validateCreateUserInput,
  validateUpdateUserInput,
  formatUserDisplay,
  getRoleDisplayName,
} from './users';

// Organizations
export type { OrganizationService } from './organizations';
export {
  InMemoryOrganizationService,
  validateCreateOrganizationInput,
  validateUpdateOrganizationInput,
  formatOrganizationDisplay,
  getOrganizationSummary,
} from './organizations';

// Permissions
export type { Permission, ResourceType } from './permissions';
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getPermissionsForRole,
  canAccessResource,
  canPerformAction,
  canAccessAdmin,
  canManageUsers,
  canManageOrganizations,
  canViewSystemMonitoring,
  filterPermissions,
  getPermissionDisplayName,
} from './permissions';

// Dashboard
export type { DashboardService } from './dashboard';
export {
  InMemoryDashboardService,
  createUserActivity,
  createSessionActivity,
  createRecordingActivity,
  createOrganizationActivity,
  getActivityTypeDisplayName,
  getActivityTypeIcon,
  getHealthStatusDisplay,
  calculateOverallHealth,
  formatRelativeTime,
} from './dashboard';
