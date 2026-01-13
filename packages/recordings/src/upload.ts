// ===========================================
// Upload Handling
// ===========================================
// Owner: Stream 5 (Call Recordings)

import type {
  AudioFormat,
  UploadConfig,
  ValidationResult,
  AudioMetadata,
  UploadProgress,
} from './types';
import { generateId } from '@underdog/core';

/**
 * Default upload configuration
 */
export const DEFAULT_UPLOAD_CONFIG: UploadConfig = {
  maxFileSizeMB: 100,
  maxDurationMinutes: 60,
  allowedFormats: ['mp3', 'wav', 'm4a', 'webm'],
  chunkSizeKB: 1024, // 1MB chunks
};

/**
 * Validate an audio file before upload
 */
export function validateFile(
  file: File,
  config: UploadConfig = DEFAULT_UPLOAD_CONFIG
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check file size
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > config.maxFileSizeMB) {
    errors.push(`File size (${fileSizeMB.toFixed(1)}MB) exceeds maximum (${config.maxFileSizeMB}MB)`);
  }

  // Check format
  const format = getAudioFormat(file.name);
  if (!format) {
    errors.push('Unable to determine audio format from filename');
  } else if (!config.allowedFormats.includes(format)) {
    errors.push(`Format "${format}" is not supported. Allowed: ${config.allowedFormats.join(', ')}`);
  }

  // Warning for large files
  if (fileSizeMB > 50) {
    warnings.push('Large file - upload may take several minutes');
  }

  const metadata: AudioMetadata = {
    filename: file.name,
    format: format ?? 'mp3',
    fileSizeBytes: file.size,
  };

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    metadata,
  };
}

/**
 * Get audio format from filename
 */
export function getAudioFormat(filename: string): AudioFormat | null {
  const ext = filename.split('.').pop()?.toLowerCase();
  const formatMap: Record<string, AudioFormat> = {
    mp3: 'mp3',
    wav: 'wav',
    m4a: 'm4a',
    webm: 'webm',
    ogg: 'ogg',
  };
  return formatMap[ext ?? ''] ?? null;
}

/**
 * Create upload progress tracker
 */
export function createUploadProgress(totalBytes: number): UploadProgress {
  return {
    uploadId: generateId(),
    status: 'pending',
    progress: 0,
    bytesUploaded: 0,
    totalBytes,
  };
}

/**
 * Update upload progress
 */
export function updateProgress(
  progress: UploadProgress,
  bytesUploaded: number
): UploadProgress {
  const percentage = Math.round((bytesUploaded / progress.totalBytes) * 100);

  return {
    ...progress,
    status: percentage < 100 ? 'uploading' : 'processing',
    progress: percentage,
    bytesUploaded,
  };
}

/**
 * Generate unique storage path for recording
 */
export function generateStoragePath(
  userId: string,
  filename: string
): string {
  const timestamp = Date.now();
  const extension = filename.split('.').pop() ?? 'mp3';
  const sanitizedFilename = filename
    .replace(/[^a-z0-9.-]/gi, '_')
    .substring(0, 50);

  return `recordings/${userId}/${timestamp}-${sanitizedFilename}.${extension}`;
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Format duration for display
 */
export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
