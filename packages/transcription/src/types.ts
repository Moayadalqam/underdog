// ===========================================
// Transcription Types
// ===========================================
// Owner: Stream 5 (Call Recordings)

/**
 * Transcription provider
 */
export type TranscriptionProvider = 'deepgram' | 'whisper' | 'assemblyai';

/**
 * Transcription request
 */
export interface TranscriptionRequest {
  audioUrl: string;
  provider?: TranscriptionProvider;
  language?: string;
  diarization?: boolean; // Speaker identification
  punctuation?: boolean;
  profanityFilter?: boolean;
}

/**
 * Transcription result
 */
export interface TranscriptionResult {
  transcriptId: string;
  text: string;
  segments: TranscriptSegment[];
  confidence: number;
  durationSeconds: number;
  language: string;
  provider: TranscriptionProvider;
  processedAt: Date;
}

/**
 * Transcript segment with timing
 */
export interface TranscriptSegment {
  id: string;
  speaker?: string;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
  words?: TranscriptWord[];
}

/**
 * Word-level timing
 */
export interface TranscriptWord {
  word: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

/**
 * Diarization result (speaker identification)
 */
export interface DiarizationResult {
  speakers: SpeakerInfo[];
  segments: DiarizedSegment[];
}

/**
 * Speaker information
 */
export interface SpeakerInfo {
  id: string;
  label: string; // "Speaker 1", "Speaker 2", etc.
  talkTimeSeconds: number;
  segmentCount: number;
}

/**
 * Segment with speaker assignment
 */
export interface DiarizedSegment extends TranscriptSegment {
  speakerId: string;
}

/**
 * Transcription client interface
 */
export interface TranscriptionClient {
  provider: TranscriptionProvider;
  transcribe(request: TranscriptionRequest): Promise<TranscriptionResult>;
  isAvailable(): Promise<boolean>;
}
