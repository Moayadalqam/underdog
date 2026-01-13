// ===========================================
// Recording Queries (Stream 5)
// ===========================================

import { prisma } from '../client';

// Define RecordingStatus type to match Prisma schema
type RecordingStatus = 'uploading' | 'processing' | 'transcribed' | 'analyzed' | 'failed';

export async function createRecording(data: {
  userId: string;
  filename: string;
  storageUrl: string;
}) {
  return prisma.recording.create({
    data,
  });
}

export async function getRecordingById(id: string) {
  return prisma.recording.findUnique({
    where: { id },
    include: { user: true },
  });
}

export async function getUserRecordings(userId: string, limit = 20) {
  return prisma.recording.findMany({
    where: { userId },
    orderBy: { uploadedAt: 'desc' },
    take: limit,
  });
}

export async function updateRecordingStatus(
  id: string,
  status: RecordingStatus,
  extra?: {
    duration?: number;
    transcriptId?: string;
    errorMessage?: string;
  }
) {
  return prisma.recording.update({
    where: { id },
    data: {
      status,
      processedAt: ['transcribed', 'analyzed', 'failed'].includes(status) ? new Date() : undefined,
      ...extra,
    },
  });
}

export async function getPendingRecordings(limit = 10) {
  return prisma.recording.findMany({
    where: {
      status: { in: ['uploading', 'processing'] },
    },
    orderBy: { uploadedAt: 'asc' },
    take: limit,
  });
}
