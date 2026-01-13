// ===========================================
// User Queries (Stream 1)
// ===========================================

import { prisma } from '../client';
import type { UserRole } from '@prisma/client';

export async function getUserById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    include: { organization: true },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { organization: true },
  });
}

export async function createUser(data: {
  email: string;
  name: string;
  role?: UserRole;
  organizationId: string;
}) {
  return prisma.user.create({
    data,
    include: { organization: true },
  });
}

export async function getUsersByOrganization(organizationId: string) {
  return prisma.user.findMany({
    where: { organizationId },
    orderBy: { createdAt: 'desc' },
  });
}
