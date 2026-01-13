// ===========================================
// Recording Types
// ===========================================
// Owner: Stream 5 (Call Recordings)

/**
 * Supported audio formats
 */
export type AudioFormat = 'mp3' | 'wav' | 'm4a' | 'webm' | 'ogg';

/**
 * Recording upload status
 */
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'complete' | 'failed';

/**
 * Upload configuration
 */
export interface UploadConfig {
  maxFileSizeMB: number;
  maxDurationMinutes: number;
  allowedFormats: AudioFormat[];
  chunkSizeKB: number;
}

/**
 * File validation result
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  metadata?: AudioMetadata;
}

/**
 * Audio file metadata
 */
export interface AudioMetadata {
  filename: string;
  format: AudioFormat;
  fileSizeBytes: number;
  durationSeconds?: number;
  sampleRate?: number;
  channels?: number;
  bitrate?: number;
}

/**
 * Upload progress
 */
export interface UploadProgress {
  uploadId: string;
  status: UploadStatus;
  progress: number; // 0-100
  bytesUploaded: number;
  totalBytes: number;
  error?: string;
}

/**
 * Completed upload
 */
export interface CompletedUpload {
  uploadId: string;
  recordingId: string;
  storageUrl: string;
  metadata: AudioMetadata;
  uploadedAt: Date;
}

/**
 * Processing job
 */
export interface ProcessingJob {
  jobId: string;
  recordingId: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  steps: ProcessingStep[];
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

/**
 * Processing step
 */
export interface ProcessingStep {
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  result?: unknown;
}
