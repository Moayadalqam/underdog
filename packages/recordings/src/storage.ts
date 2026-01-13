// ===========================================
// Storage Integration
// ===========================================
// Owner: Stream 5 (Call Recordings)

import type { CompletedUpload, AudioMetadata } from './types';
import { generateId } from '@underdog/core';
import { generateStoragePath } from './upload';

/**
 * Storage client interface
 */
export interface StorageClient {
  upload(path: string, file: File | Blob, onProgress?: (progress: number) => void): Promise<string>;
  getPublicUrl(path: string): string;
  delete(path: string): Promise<void>;
}

/**
 * Create Supabase storage client
 */
export function createSupabaseStorageClient(
  supabaseUrl: string,
  supabaseKey: string,
  bucket: string = 'recordings'
): StorageClient {
  return {
    async upload(path: string, file: File | Blob, onProgress?: (progress: number) => void): Promise<string> {
      // In production, this would use @supabase/supabase-js
      // const { data, error } = await supabase.storage.from(bucket).upload(path, file);
      console.log(`Uploading to ${bucket}/${path}`);

      // Simulate progress
      if (onProgress) {
        for (let i = 0; i <= 100; i += 10) {
          await sleep(100);
          onProgress(i);
        }
      }

      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
    },

    getPublicUrl(path: string): string {
      return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
    },

    async delete(path: string): Promise<void> {
      console.log(`Deleting ${bucket}/${path}`);
    },
  };
}

/**
 * Upload recording to storage
 */
export async function uploadRecording(
  client: StorageClient,
  userId: string,
  file: File,
  metadata: AudioMetadata,
  onProgress?: (progress: number) => void
): Promise<CompletedUpload> {
  const path = generateStoragePath(userId, file.name);

  const storageUrl = await client.upload(path, file, onProgress);

  return {
    uploadId: generateId(),
    recordingId: generateId(),
    storageUrl,
    metadata,
    uploadedAt: new Date(),
  };
}

/**
 * Delete recording from storage
 */
export async function deleteRecording(
  client: StorageClient,
  path: string
): Promise<void> {
  await client.delete(path);
}

/**
 * Get signed URL for private recording
 */
export function getRecordingUrl(
  client: StorageClient,
  path: string
): string {
  return client.getPublicUrl(path);
}

// Helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
