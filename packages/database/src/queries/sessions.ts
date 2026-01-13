// ===========================================
// Training Session Queries (Stream 2)
// ===========================================

import { prisma } from '../client';
import type { SessionType, SessionStatus } from '@prisma/client';

export async function createSession(data: {
  userId: string;
  type: SessionType;
  moduleId?: string;
  scenarioId?: string;
}) {
  return prisma.trainingSession.create({
    data,
    include: {
      module: true,
      scenario: true,
    },
  });
}

export async function getSessionById(id: string) {
  return prisma.trainingSession.findUnique({
    where: { id },
    include: {
      module: true,
      scenario: true,
      transcript: {
        include: { segments: true },
      },
      scores: true,
    },
  });
}

export async function updateSessionStatus(id: string, status: SessionStatus) {
  return prisma.trainingSession.update({
    where: { id },
    data: {
      status,
      endedAt: status === 'completed' || status === 'abandoned' ? new Date() : undefined,
    },
  });
}

export async function getUserSessions(userId: string, limit = 20) {
  return prisma.trainingSession.findMany({
    where: { userId },
    include: {
      module: true,
      scores: true,
    },
    orderBy: { startedAt: 'desc' },
    take: limit,
  });
}
