// ===========================================
// Permission Management
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { User, UserRole } from '@underdog/core';
import type { PermissionCheck } from './types';

/**
 * Permission types
 */
export type Permission =
  | 'users:read'
  | 'users:create'
  | 'users:update'
  | 'users:delete'
  | 'organizations:read'
  | 'organizations:create'
  | 'organizations:update'
  | 'organizations:delete'
  | 'sessions:read'
  | 'sessions:read_all'
  | 'recordings:read'
  | 'recordings:read_all'
  | 'recordings:delete'
  | 'analytics:read'
  | 'analytics:read_all'
  | 'curriculum:read'
  | 'curriculum:update'
  | 'admin:access'
  | 'system:monitor';

/**
 * Resource types for permission checks
 */
export type ResourceType = 'user' | 'organization' | 'session' | 'recording' | 'analytics';

/**
 * Permission matrix by role
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'users:read',
    'users:create',
    'users:update',
    'users:delete',
    'organizations:read',
    'organizations:create',
    'organizations:update',
    'organizations:delete',
    'sessions:read',
    'sessions:read_all',
    'recordings:read',
    'recordings:read_all',
    'recordings:delete',
    'analytics:read',
    'analytics:read_all',
    'curriculum:read',
    'curriculum:update',
    'admin:access',
    'system:monitor',
  ],
  trainer: [
    'users:read',
    'sessions:read',
    'sessions:read_all',
    'recordings:read',
    'recordings:read_all',
    'analytics:read',
    'analytics:read_all',
    'curriculum:read',
  ],
  trainee: [
    'sessions:read',
    'recordings:read',
    'analytics:read',
    'curriculum:read',
  ],
};

/**
 * Check if user has a specific permission
 */
export function hasPermission(user: User, permission: Permission): boolean {
  const permissions = ROLE_PERMISSIONS[user.role] ?? [];
  return permissions.includes(permission);
}

/**
 * Check if user has all specified permissions
 */
export function hasAllPermissions(user: User, permissions: Permission[]): boolean {
  return permissions.every(p => hasPermission(user, p));
}

/**
 * Check if user has any of the specified permissions
 */
export function hasAnyPermission(user: User, permissions: Permission[]): boolean {
  return permissions.some(p => hasPermission(user, p));
}

/**
 * Get all permissions for a role
 */
export function getPermissionsForRole(role: UserRole): Permission[] {
  return [...ROLE_PERMISSIONS[role]];
}

/**
 * Check if user can access resource
 */
export function canAccessResource(
  user: User,
  resourceType: ResourceType,
  resourceOwnerId?: string
): PermissionCheck {
  // Admins can access everything
  if (user.role === 'admin') {
    return { allowed: true };
  }

  // Check resource-specific permissions
  switch (resourceType) {
    case 'user':
      if (!hasPermission(user, 'users:read')) {
        return { allowed: false, reason: 'No permission to view users' };
      }
      break;

    case 'organization':
      if (!hasPermission(user, 'organizations:read')) {
        return { allowed: false, reason: 'No permission to view organizations' };
      }
      break;

    case 'session':
      if (!hasPermission(user, 'sessions:read')) {
        return { allowed: false, reason: 'No permission to view sessions' };
      }
      // Non-admins can only see their own sessions unless they have read_all
      if (resourceOwnerId && resourceOwnerId !== user.id && !hasPermission(user, 'sessions:read_all')) {
        return { allowed: false, reason: 'Can only view your own sessions' };
      }
      break;

    case 'recording':
      if (!hasPermission(user, 'recordings:read')) {
        return { allowed: false, reason: 'No permission to view recordings' };
      }
      // Non-admins can only see their own recordings unless they have read_all
      if (resourceOwnerId && resourceOwnerId !== user.id && !hasPermission(user, 'recordings:read_all')) {
        return { allowed: false, reason: 'Can only view your own recordings' };
      }
      break;

    case 'analytics':
      if (!hasPermission(user, 'analytics:read')) {
        return { allowed: false, reason: 'No permission to view analytics' };
      }
      // Non-admins can only see their own analytics unless they have read_all
      if (resourceOwnerId && resourceOwnerId !== user.id && !hasPermission(user, 'analytics:read_all')) {
        return { allowed: false, reason: 'Can only view your own analytics' };
      }
      break;
  }

  return { allowed: true };
}

/**
 * Check if user can perform action
 */
export function canPerformAction(
  user: User,
  action: 'create' | 'update' | 'delete',
  resourceType: ResourceType,
  resourceOwnerId?: string
): PermissionCheck {
  // Build permission key
  const permissionKey = `${resourceType}s:${action}` as Permission;

  // Check basic permission
  if (!hasPermission(user, permissionKey)) {
    return {
      allowed: false,
      reason: `No permission to ${action} ${resourceType}s`,
    };
  }

  // For update/delete, check ownership (unless admin)
  if ((action === 'update' || action === 'delete') && resourceOwnerId) {
    if (user.role !== 'admin' && resourceOwnerId !== user.id) {
      // Check if user has _all variant permission
      const allPermission = `${resourceType}s:${action}_all` as Permission;
      if (!hasPermission(user, allPermission)) {
        return {
          allowed: false,
          reason: `Can only ${action} your own ${resourceType}s`,
        };
      }
    }
  }

  return { allowed: true };
}

/**
 * Check if user can access admin console
 */
export function canAccessAdmin(user: User): PermissionCheck {
  if (!hasPermission(user, 'admin:access')) {
    return { allowed: false, reason: 'Admin access required' };
  }
  return { allowed: true };
}

/**
 * Check if user can manage other users
 */
export function canManageUsers(user: User): PermissionCheck {
  if (!hasAllPermissions(user, ['users:read', 'users:create', 'users:update'])) {
    return { allowed: false, reason: 'User management permission required' };
  }
  return { allowed: true };
}

/**
 * Check if user can manage organizations
 */
export function canManageOrganizations(user: User): PermissionCheck {
  if (!hasAllPermissions(user, ['organizations:read', 'organizations:create', 'organizations:update'])) {
    return { allowed: false, reason: 'Organization management permission required' };
  }
  return { allowed: true };
}

/**
 * Check if user can view system monitoring
 */
export function canViewSystemMonitoring(user: User): PermissionCheck {
  if (!hasPermission(user, 'system:monitor')) {
    return { allowed: false, reason: 'System monitoring permission required' };
  }
  return { allowed: true };
}

/**
 * Filter list of permissions to only those the user has
 */
export function filterPermissions(user: User, permissions: Permission[]): Permission[] {
  return permissions.filter(p => hasPermission(user, p));
}

/**
 * Get human-readable permission name
 */
export function getPermissionDisplayName(permission: Permission): string {
  const displayNames: Record<Permission, string> = {
    'users:read': 'View Users',
    'users:create': 'Create Users',
    'users:update': 'Edit Users',
    'users:delete': 'Delete Users',
    'organizations:read': 'View Organizations',
    'organizations:create': 'Create Organizations',
    'organizations:update': 'Edit Organizations',
    'organizations:delete': 'Delete Organizations',
    'sessions:read': 'View Own Sessions',
    'sessions:read_all': 'View All Sessions',
    'recordings:read': 'View Own Recordings',
    'recordings:read_all': 'View All Recordings',
    'recordings:delete': 'Delete Recordings',
    'analytics:read': 'View Own Analytics',
    'analytics:read_all': 'View All Analytics',
    'curriculum:read': 'View Curriculum',
    'curriculum:update': 'Edit Curriculum',
    'admin:access': 'Admin Console Access',
    'system:monitor': 'System Monitoring',
  };
  return displayNames[permission] ?? permission;
}
