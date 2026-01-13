// ===========================================
// Curriculum Queries (Stream 3)
// ===========================================

import { prisma } from '../client';

export async function getAllModules() {
  return prisma.curriculumModule.findMany({
    where: { isActive: true },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
      _count: {
        select: { scenarios: true },
      },
    },
    orderBy: { number: 'asc' },
  });
}

export async function getModuleById(id: string) {
  return prisma.curriculumModule.findUnique({
    where: { id },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
      scenarios: {
        where: { isActive: true },
      },
    },
  });
}

export async function getModuleByNumber(number: number) {
  return prisma.curriculumModule.findUnique({
    where: { number },
    include: {
      lessons: {
        orderBy: { order: 'asc' },
      },
      scenarios: {
        where: { isActive: true },
      },
    },
  });
}

export async function getUserProgress(userId: string) {
  return prisma.userProgress.findMany({
    where: { userId },
    include: {
      module: true,
      lesson: true,
    },
    orderBy: { updatedAt: 'desc' },
  });
}

export async function updateProgress(data: {
  userId: string;
  moduleId: string;
  lessonId?: string;
  score?: number;
  completed?: boolean;
}) {
  const { userId, moduleId, lessonId, score, completed } = data;

  return prisma.userProgress.upsert({
    where: {
      userId_moduleId_lessonId: {
        userId,
        moduleId,
        lessonId: lessonId ?? '',
      },
    },
    update: {
      score,
      completedAt: completed ? new Date() : undefined,
    },
    create: {
      userId,
      moduleId,
      lessonId,
      score,
      completedAt: completed ? new Date() : undefined,
    },
  });
}

export async function getObjectionsByCategory(category?: string) {
  return prisma.objection.findMany({
    where: {
      isActive: true,
      ...(category && { category: category as any }),
    },
    orderBy: { difficulty: 'asc' },
  });
}
