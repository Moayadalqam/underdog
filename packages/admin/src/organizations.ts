// ===========================================
// Organization Management
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { Organization } from '@underdog/core';
import type {
  OrganizationWithStats,
  CreateOrganizationInput,
  UpdateOrganizationInput,
  PaginationOptions,
  PaginatedResult,
  OrganizationFilters,
} from './types';
import { generateId } from '@underdog/core';

/**
 * Organization service interface
 */
export interface OrganizationService {
  getOrganizations(
    filters: OrganizationFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<OrganizationWithStats>>;
  getOrganizationById(id: string): Promise<OrganizationWithStats | null>;
  createOrganization(input: CreateOrganizationInput): Promise<OrganizationWithStats>;
  updateOrganization(id: string, input: UpdateOrganizationInput): Promise<OrganizationWithStats>;
  deleteOrganization(id: string): Promise<void>;
}

/**
 * In-memory organization service for development/testing
 */
export class InMemoryOrganizationService implements OrganizationService {
  private organizations: Map<string, OrganizationWithStats> = new Map();

  async getOrganizations(
    filters: OrganizationFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<OrganizationWithStats>> {
    let items = Array.from(this.organizations.values());

    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      items = items.filter(o => o.name.toLowerCase().includes(search));
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

  async getOrganizationById(id: string): Promise<OrganizationWithStats | null> {
    return this.organizations.get(id) ?? null;
  }

  async createOrganization(input: CreateOrganizationInput): Promise<OrganizationWithStats> {
    // Check for duplicate name
    const existing = Array.from(this.organizations.values()).find(
      o => o.name.toLowerCase() === input.name.toLowerCase()
    );
    if (existing) {
      throw new Error('Organization with this name already exists');
    }

    const now = new Date();
    const org: OrganizationWithStats = {
      id: generateId(),
      name: input.name,
      createdAt: now,
      updatedAt: now,
      userCount: 0,
      activeSessionCount: 0,
      totalSessions: 0,
    };

    this.organizations.set(org.id, org);
    return org;
  }

  async updateOrganization(
    id: string,
    input: UpdateOrganizationInput
  ): Promise<OrganizationWithStats> {
    const org = await this.getOrganizationById(id);
    if (!org) {
      throw new Error('Organization not found');
    }

    // Check for duplicate name if changing name
    if (input.name && input.name !== org.name) {
      const existing = Array.from(this.organizations.values()).find(
        o => o.name.toLowerCase() === input.name!.toLowerCase() && o.id !== id
      );
      if (existing) {
        throw new Error('Organization with this name already exists');
      }
    }

    const updated: OrganizationWithStats = {
      ...org,
      ...input,
      updatedAt: new Date(),
    };

    this.organizations.set(id, updated);
    return updated;
  }

  async deleteOrganization(id: string): Promise<void> {
    const org = await this.getOrganizationById(id);
    if (!org) {
      throw new Error('Organization not found');
    }

    // Check if organization has users
    if (org.userCount > 0) {
      throw new Error('Cannot delete organization with active users');
    }

    this.organizations.delete(id);
  }

  // Helper for seeding data
  seed(organizations: OrganizationWithStats[]): void {
    for (const org of organizations) {
      this.organizations.set(org.id, org);
    }
  }

  // Helper to update stats
  updateStats(id: string, stats: Partial<Pick<OrganizationWithStats, 'userCount' | 'activeSessionCount' | 'totalSessions'>>): void {
    const org = this.organizations.get(id);
    if (org) {
      this.organizations.set(id, { ...org, ...stats });
    }
  }
}

/**
 * Validate organization creation input
 */
export function validateCreateOrganizationInput(input: CreateOrganizationInput): string[] {
  const errors: string[] = [];

  if (!input.name || input.name.trim().length < 2) {
    errors.push('Organization name must be at least 2 characters');
  }
  if (input.name && input.name.length > 100) {
    errors.push('Organization name must be less than 100 characters');
  }

  return errors;
}

/**
 * Validate organization update input
 */
export function validateUpdateOrganizationInput(input: UpdateOrganizationInput): string[] {
  const errors: string[] = [];

  if (input.name !== undefined) {
    if (input.name.trim().length < 2) {
      errors.push('Organization name must be at least 2 characters');
    }
    if (input.name.length > 100) {
      errors.push('Organization name must be less than 100 characters');
    }
  }

  return errors;
}

/**
 * Format organization display
 */
export function formatOrganizationDisplay(org: Organization): string {
  return org.name;
}

/**
 * Get organization summary
 */
export function getOrganizationSummary(org: OrganizationWithStats): string {
  const parts: string[] = [org.name];

  if (org.userCount > 0) {
    parts.push(`${org.userCount} user${org.userCount !== 1 ? 's' : ''}`);
  }
  if (org.totalSessions > 0) {
    parts.push(`${org.totalSessions} session${org.totalSessions !== 1 ? 's' : ''}`);
  }

  return parts.join(' - ');
}
