// ===========================================
// @underdog/voice - TTS/STT Services
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Voice services for the AI role-play engine.
// - TTS: Chatterbox (primary), ElevenLabs (fallback)
// - STT: Deepgram (real-time streaming)

// ----- Type Exports -----
export type {
  VoiceEmotion,
  TTSConfig,
  TTSResult,
  TTSService,
  VoiceInfo,
  STTConfig,
  STTResult,
  STTService,
  STTStreamController,
  STTStreamCallback,
  STTStreamEvent,
  TranscriptWord,
} from './types';

export {
  VoiceServiceError,
  TTSError,
  STTError,
} from './types';

// ----- TTS Exports -----
export {
  ChatterboxTTSClient,
  createChatterboxClient,
  type ChatterboxConfig,
} from './tts/chatterbox';

export {
  ElevenLabsTTSClient,
  createElevenLabsClient,
  type ElevenLabsConfig,
} from './tts/elevenlabs';

// ----- STT Exports -----
export {
  DeepgramSTTClient,
  createDeepgramClient,
  type DeepgramConfig,
} from './stt/deepgram';

// ----- Composite Voice Service -----

import { TTSService, TTSConfig, TTSResult, TTSError } from './types';
import { ChatterboxTTSClient, ChatterboxConfig } from './tts/chatterbox';
import { ElevenLabsTTSClient, ElevenLabsConfig } from './tts/elevenlabs';

/**
 * Configuration for the composite voice service.
 */
export interface VoiceServiceConfig {
  /** Primary TTS provider configuration (Chatterbox) */
  chatterbox?: ChatterboxConfig;
  /** Fallback TTS provider configuration (ElevenLabs) */
  elevenlabs?: ElevenLabsConfig;
  /** Whether to automatically fallback if primary fails */
  enableFallback?: boolean;
}

/**
 * Composite voice service that provides automatic failover
 * from Chatterbox to ElevenLabs when needed.
 */
export class VoiceService {
  private primary: TTSService | null = null;
  private fallback: TTSService | null = null;
  private readonly enableFallback: boolean;

  constructor(config: VoiceServiceConfig) {
    if (config.chatterbox) {
      this.primary = new ChatterboxTTSClient(config.chatterbox);
    }

    if (config.elevenlabs) {
      this.fallback = new ElevenLabsTTSClient(config.elevenlabs);
    }

    this.enableFallback = config.enableFallback ?? true;
  }

  /**
   * Synthesize text to speech with automatic failover.
   * @param text - Text to synthesize
   * @param config - Voice configuration
   * @returns Synthesized audio result
   */
  async synthesize(text: string, config: TTSConfig): Promise<TTSResult> {
    // Try primary first
    if (this.primary) {
      try {
        const isAvailable = await this.primary.isAvailable();
        if (isAvailable) {
          return await this.primary.synthesize(text, config);
        }
      } catch (error) {
        if (!this.enableFallback || !this.fallback) {
          throw error;
        }
        console.warn(
          `Primary TTS (${this.primary.provider}) failed, falling back`,
          error
        );
      }
    }

    // Try fallback
    if (this.fallback) {
      try {
        return await this.fallback.synthesize(text, config);
      } catch (error) {
        throw new TTSError(
          `All TTS providers failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          'voice-service',
          'ALL_PROVIDERS_FAILED',
          error instanceof Error ? error : undefined
        );
      }
    }

    throw new TTSError(
      'No TTS providers configured',
      'voice-service',
      'NO_PROVIDERS'
    );
  }

  /**
   * Check if any TTS service is available.
   */
  async isAvailable(): Promise<boolean> {
    const primaryAvailable = this.primary
      ? await this.primary.isAvailable()
      : false;
    const fallbackAvailable = this.fallback
      ? await this.fallback.isAvailable()
      : false;

    return primaryAvailable || fallbackAvailable;
  }

  /**
   * Get the currently active TTS provider name.
   */
  async getActiveProvider(): Promise<string | null> {
    if (this.primary && (await this.primary.isAvailable())) {
      return this.primary.provider;
    }
    if (this.fallback && (await this.fallback.isAvailable())) {
      return this.fallback.provider;
    }
    return null;
  }
}

/**
 * Create a VoiceService from environment variables.
 * @returns Configured VoiceService with available providers
 */
export function createVoiceService(): VoiceService {
  const config: VoiceServiceConfig = {
    enableFallback: true,
  };

  // Configure Chatterbox if available
  if (process.env.CHATTERBOX_API_URL) {
    config.chatterbox = {
      baseUrl: process.env.CHATTERBOX_API_URL,
      apiKey: process.env.CHATTERBOX_API_KEY,
      timeout: parseInt(process.env.CHATTERBOX_TIMEOUT ?? '30000', 10),
      defaultVoiceId: process.env.CHATTERBOX_DEFAULT_VOICE,
    };
  }

  // Configure ElevenLabs if available
  if (process.env.ELEVENLABS_API_KEY) {
    config.elevenlabs = {
      apiKey: process.env.ELEVENLABS_API_KEY,
      timeout: parseInt(process.env.ELEVENLABS_TIMEOUT ?? '30000', 10),
      defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE,
      modelId: process.env.ELEVENLABS_MODEL_ID,
    };
  }

  return new VoiceService(config);
}
