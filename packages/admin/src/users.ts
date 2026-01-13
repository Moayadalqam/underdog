// ===========================================
// User Management
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { User, UserRole } from '@underdog/core';
import type {
  UserWithDetails,
  CreateUserInput,
  UpdateUserInput,
  PaginationOptions,
  PaginatedResult,
  UserFilters,
  BulkOperationResult,
} from './types';
import { generateId } from '@underdog/core';

/**
 * User service interface for dependency injection
 */
export interface UserService {
  getUsers(filters: UserFilters, pagination: PaginationOptions): Promise<PaginatedResult<UserWithDetails>>;
  getUserById(id: string): Promise<UserWithDetails | null>;
  getUserByEmail(email: string): Promise<UserWithDetails | null>;
  createUser(input: CreateUserInput): Promise<UserWithDetails>;
  updateUser(id: string, input: UpdateUserInput): Promise<UserWithDetails>;
  deleteUser(id: string): Promise<void>;
  bulkDeleteUsers(ids: string[]): Promise<BulkOperationResult>;
  bulkUpdateRole(ids: string[], role: UserRole): Promise<BulkOperationResult>;
}

/**
 * In-memory user service for development/testing
 */
export class InMemoryUserService implements UserService {
  private users: Map<string, UserWithDetails> = new Map();

  async getUsers(
    filters: UserFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<UserWithDetails>> {
    let items = Array.from(this.users.values());

    // Apply filters
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(
        u => u.name.toLowerCase().includes(search) || u.email.toLowerCase().includes(search)
      );
    }
    if (filters.role) {
      items = items.filter(u => u.role === filters.role);
    }
    if (filters.organizationId) {
      items = items.filter(u => u.organizationId === filters.organizationId);
    }

    // Sort by name
    items.sort((a, b) => a.name.localeCompare(b.name));

    // Paginate
    const total = items.length;
    const start = (pagination.page - 1) * pagination.pageSize;
    const paginatedItems = items.slice(start, start + pagination.pageSize);

    return {
      items: paginatedItems,
      total,
      page: pagination.page,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(total / pagination.pageSize),
    };
  }

  async getUserById(id: string): Promise<UserWithDetails | null> {
    return this.users.get(id) ?? null;
  }

  async getUserByEmail(email: string): Promise<UserWithDetails | null> {
    return Array.from(this.users.values()).find(u => u.email === email) ?? null;
  }

  async createUser(input: CreateUserInput): Promise<UserWithDetails> {
    const existing = await this.getUserByEmail(input.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const now = new Date();
    const user: UserWithDetails = {
      id: generateId(),
      email: input.email,
      name: input.name,
      role: input.role,
      organizationId: input.organizationId,
      createdAt: now,
      updatedAt: now,
      sessionCount: 0,
    };

    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: string, input: UpdateUserInput): Promise<UserWithDetails> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }

    const updated: UserWithDetails = {
      ...user,
      ...input,
      updatedAt: new Date(),
    };

    this.users.set(id, updated);
    return updated;
  }

  async deleteUser(id: string): Promise<void> {
    if (!this.users.has(id)) {
      throw new Error('User not found');
    }
    this.users.delete(id);
  }

  async bulkDeleteUsers(ids: string[]): Promise<BulkOperationResult> {
    const successful: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const id of ids) {
      try {
        await this.deleteUser(id);
        successful.push(id);
      } catch (error) {
        failed.push({ id, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return { successful, failed };
  }

  async bulkUpdateRole(ids: string[], role: UserRole): Promise<BulkOperationResult> {
    const successful: string[] = [];
    const failed: { id: string; error: string }[] = [];

    for (const id of ids) {
      try {
        await this.updateUser(id, { role });
        successful.push(id);
      } catch (error) {
        failed.push({ id, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    return { successful, failed };
  }

  // Helper for seeding data
  seed(users: UserWithDetails[]): void {
    for (const user of users) {
      this.users.set(user.id, user);
    }
  }
}

/**
 * Validate user creation input
 */
export function validateCreateUserInput(input: CreateUserInput): string[] {
  const errors: string[] = [];

  if (!input.email || !input.email.includes('@')) {
    errors.push('Valid email is required');
  }
  if (!input.name || input.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (!input.organizationId) {
    errors.push('Organization is required');
  }
  if (!['admin', 'trainer', 'trainee'].includes(input.role)) {
    errors.push('Invalid role');
  }

  return errors;
}

/**
 * Validate user update input
 */
export function validateUpdateUserInput(input: UpdateUserInput): string[] {
  const errors: string[] = [];

  if (input.name !== undefined && input.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters');
  }
  if (input.role !== undefined && !['admin', 'trainer', 'trainee'].includes(input.role)) {
    errors.push('Invalid role');
  }

  return errors;
}

/**
 * Format user for display
 */
export function formatUserDisplay(user: User): string {
  return `${user.name} (${user.email})`;
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: UserRole): string {
  const names: Record<UserRole, string> = {
    admin: 'Administrator',
    trainer: 'Trainer',
    trainee: 'Trainee',
  };
  return names[role];
}
