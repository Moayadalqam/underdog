// ===========================================
// @underdog/transcription - STT Integration
// ===========================================
// Owner: Stream 5 (Call Recordings)

// Types
export type {
  TranscriptionProvider,
  TranscriptionRequest,
  TranscriptionResult,
  TranscriptSegment,
  TranscriptWord,
  DiarizationResult,
  SpeakerInfo,
  DiarizedSegment,
  TranscriptionClient,
} from './types';

// Providers
export {
  DeepgramTranscriptionClient,
  createDeepgramTranscriptionClient,
  type DeepgramConfig,
} from './providers/deepgram';
