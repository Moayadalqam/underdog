// ===========================================
// Voice Service Type Definitions
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)

/**
 * Supported emotion types for TTS voice synthesis.
 * Used to control prosody and tone of generated speech.
 */
export type VoiceEmotion =
  | 'neutral'
  | 'skeptical'
  | 'impatient'
  | 'interested'
  | 'annoyed'
  | 'friendly'
  | 'professional';

/**
 * Configuration for TTS voice synthesis requests.
 */
export interface TTSConfig {
  /** Voice ID or name from the TTS provider */
  voiceId: string;
  /** Speaking rate multiplier (0.5 = half speed, 2.0 = double speed) */
  speed?: number;
  /** Pitch adjustment (-1.0 to 1.0) */
  pitch?: number;
  /** Emotion to apply to speech synthesis */
  emotion?: VoiceEmotion;
  /** Audio output format */
  outputFormat?: 'mp3' | 'wav' | 'ogg' | 'pcm';
  /** Sample rate in Hz */
  sampleRate?: 16000 | 22050 | 44100 | 48000;
}

/**
 * Result from a TTS synthesis operation.
 */
export interface TTSResult {
  /** Audio data as a Buffer or base64-encoded string */
  audio: Buffer | string;
  /** Duration of the generated audio in milliseconds */
  durationMs: number;
  /** MIME type of the audio */
  mimeType: string;
  /** Characters processed (for billing/tracking) */
  charactersProcessed: number;
}

/**
 * Interface for Text-to-Speech service implementations.
 */
export interface TTSService {
  /** Provider name for identification */
  readonly provider: string;

  /**
   * Synthesize text to speech audio.
   * @param text - The text to synthesize
   * @param config - Voice configuration options
   * @returns Promise resolving to the synthesized audio
   * @throws TTSError if synthesis fails
   */
  synthesize(text: string, config: TTSConfig): Promise<TTSResult>;

  /**
   * List available voices from this provider.
   * @returns Promise resolving to array of available voice configurations
   */
  listVoices(): Promise<VoiceInfo[]>;

  /**
   * Check if the service is available and properly configured.
   * @returns Promise resolving to true if service is ready
   */
  isAvailable(): Promise<boolean>;
}

/**
 * Information about an available voice.
 */
export interface VoiceInfo {
  /** Unique voice identifier */
  id: string;
  /** Display name for the voice */
  name: string;
  /** Language code (e.g., 'en-US') */
  language: string;
  /** Gender classification */
  gender: 'male' | 'female' | 'neutral';
  /** Brief description of voice characteristics */
  description?: string;
  /** Preview audio URL if available */
  previewUrl?: string;
}

// ----- STT Types -----

/**
 * Configuration for STT transcription requests.
 */
export interface STTConfig {
  /** Language code for transcription (e.g., 'en-US') */
  language?: string;
  /** Whether to include punctuation in transcript */
  punctuate?: boolean;
  /** Whether to filter profanity */
  profanityFilter?: boolean;
  /** Custom vocabulary/keywords to boost */
  keywords?: string[];
  /** Expected audio sample rate */
  sampleRate?: number;
  /** Number of audio channels */
  channels?: 1 | 2;
  /** Audio encoding format */
  encoding?: 'linear16' | 'mp3' | 'opus' | 'webm';
}

/**
 * A single word in the transcript with timing information.
 */
export interface TranscriptWord {
  /** The transcribed word */
  word: string;
  /** Start time in seconds */
  start: number;
  /** End time in seconds */
  end: number;
  /** Confidence score (0-1) */
  confidence: number;
  /** Whether this word was detected as a speaker change */
  speakerChange?: boolean;
}

/**
 * Result from an STT transcription operation.
 */
export interface STTResult {
  /** Full transcript text */
  transcript: string;
  /** Overall confidence score (0-1) */
  confidence: number;
  /** Word-level timing and confidence */
  words: TranscriptWord[];
  /** Audio duration in seconds */
  durationSeconds: number;
  /** Whether this is a final or interim result */
  isFinal: boolean;
}

/**
 * Event emitted during streaming STT.
 */
export interface STTStreamEvent {
  type: 'interim' | 'final' | 'error' | 'close';
  result?: STTResult;
  error?: Error;
}

/**
 * Callback type for streaming STT events.
 */
export type STTStreamCallback = (event: STTStreamEvent) => void;

/**
 * Interface for Speech-to-Text service implementations.
 */
export interface STTService {
  /** Provider name for identification */
  readonly provider: string;

  /**
   * Transcribe audio from a buffer.
   * @param audio - Audio data buffer
   * @param config - Transcription configuration
   * @returns Promise resolving to transcription result
   * @throws STTError if transcription fails
   */
  transcribe(audio: Buffer, config?: STTConfig): Promise<STTResult>;

  /**
   * Start a streaming transcription session.
   * @param config - Transcription configuration
   * @param callback - Callback for streaming events
   * @returns Stream controller for managing the session
   */
  startStream(config: STTConfig, callback: STTStreamCallback): STTStreamController;

  /**
   * Check if the service is available and properly configured.
   * @returns Promise resolving to true if service is ready
   */
  isAvailable(): Promise<boolean>;
}

/**
 * Controller for managing a streaming STT session.
 */
export interface STTStreamController {
  /**
   * Send audio data to the stream.
   * @param audio - Audio chunk to process
   */
  write(audio: Buffer): void;

  /**
   * Signal end of audio input and finalize transcription.
   */
  end(): void;

  /**
   * Abort the streaming session.
   */
  abort(): void;

  /** Whether the stream is currently active */
  readonly isActive: boolean;
}

// ----- Error Types -----

/**
 * Base error class for voice service errors.
 */
export class VoiceServiceError extends Error {
  constructor(
    message: string,
    public readonly provider: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'VoiceServiceError';
  }
}

/**
 * Error thrown by TTS services.
 */
export class TTSError extends VoiceServiceError {
  constructor(message: string, provider: string, code: string, cause?: Error) {
    super(message, provider, code, cause);
    this.name = 'TTSError';
  }
}

/**
 * Error thrown by STT services.
 */
export class STTError extends VoiceServiceError {
  constructor(message: string, provider: string, code: string, cause?: Error) {
    super(message, provider, code, cause);
    this.name = 'STTError';
  }
}
