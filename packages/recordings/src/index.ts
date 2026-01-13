// ===========================================
// @underdog/recordings - Call Recording Pipeline
// ===========================================
// Owner: Stream 5 (Call Recordings)

// Types
export type {
  AudioFormat,
  UploadStatus,
  UploadConfig,
  ValidationResult,
  AudioMetadata,
  UploadProgress,
  CompletedUpload,
  ProcessingJob,
  ProcessingStep,
} from './types';

// Upload
export {
  DEFAULT_UPLOAD_CONFIG,
  validateFile,
  getAudioFormat,
  createUploadProgress,
  updateProgress,
  generateStoragePath,
  formatFileSize,
  formatDuration,
} from './upload';

// Storage
export type { StorageClient } from './storage';
export {
  createSupabaseStorageClient,
  uploadRecording,
  deleteRecording,
  getRecordingUrl,
} from './storage';
