// ===========================================
// Chatterbox TTS Client
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Chatterbox is an open-source, emotion-controllable TTS model.
// This client integrates with a self-hosted Chatterbox API.

import {
  TTSService,
  TTSConfig,
  TTSResult,
  VoiceInfo,
  TTSError,
  VoiceEmotion,
} from '../types';

/**
 * Configuration for the Chatterbox TTS client.
 */
export interface ChatterboxConfig {
  /** Base URL for the Chatterbox API server */
  baseUrl: string;
  /** API key for authentication (if required) */
  apiKey?: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Default voice to use if not specified */
  defaultVoiceId?: string;
}

/**
 * Emotion to Chatterbox exaggeration/style mapping.
 * Chatterbox uses numeric exaggeration values (0.0-1.0).
 */
const EMOTION_MAPPING: Record<VoiceEmotion, { exaggeration: number; cfg: number }> = {
  neutral: { exaggeration: 0.3, cfg: 0.5 },
  skeptical: { exaggeration: 0.5, cfg: 0.7 },
  impatient: { exaggeration: 0.7, cfg: 0.8 },
  interested: { exaggeration: 0.4, cfg: 0.6 },
  annoyed: { exaggeration: 0.8, cfg: 0.9 },
  friendly: { exaggeration: 0.35, cfg: 0.5 },
  professional: { exaggeration: 0.25, cfg: 0.4 },
};

/**
 * Chatterbox TTS client implementation.
 * Provides emotion-controllable speech synthesis for prospect simulation.
 */
export class ChatterboxTTSClient implements TTSService {
  public readonly provider = 'chatterbox';

  private readonly baseUrl: string;
  private readonly apiKey?: string;
  private readonly timeout: number;
  private readonly defaultVoiceId: string;

  constructor(config: ChatterboxConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '');
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.defaultVoiceId = config.defaultVoiceId ?? 'default';
  }

  /**
   * Synthesize text to speech using Chatterbox.
   * @param text - Text to synthesize
   * @param config - Voice configuration options
   * @returns Synthesized audio result
   */
  async synthesize(text: string, config: TTSConfig): Promise<TTSResult> {
    if (!text || text.trim().length === 0) {
      throw new TTSError('Text cannot be empty', this.provider, 'EMPTY_TEXT');
    }

    const voiceId = config.voiceId || this.defaultVoiceId;
    const emotion = config.emotion || 'neutral';
    const emotionParams = EMOTION_MAPPING[emotion];

    const requestBody = {
      text: text.trim(),
      voice_id: voiceId,
      exaggeration: emotionParams.exaggeration,
      cfg_weight: emotionParams.cfg,
      speed: config.speed ?? 1.0,
      output_format: config.outputFormat ?? 'wav',
      sample_rate: config.sampleRate ?? 22050,
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/v1/synthesize`, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new TTSError(
          `Chatterbox API error: ${response.status} - ${errorText}`,
          this.provider,
          `HTTP_${response.status}`
        );
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());
      const durationMs = this.estimateAudioDuration(
        audioBuffer.length,
        config.sampleRate ?? 22050,
        config.outputFormat ?? 'wav'
      );

      return {
        audio: audioBuffer,
        durationMs,
        mimeType: this.getMimeType(config.outputFormat ?? 'wav'),
        charactersProcessed: text.length,
      };
    } catch (error) {
      if (error instanceof TTSError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new TTSError('Request timeout', this.provider, 'TIMEOUT', error);
      }
      throw new TTSError(
        `Failed to synthesize speech: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.provider,
        'SYNTHESIS_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * List available voices from Chatterbox.
   * @returns Array of available voice configurations
   */
  async listVoices(): Promise<VoiceInfo[]> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/v1/voices`, {
        method: 'GET',
        headers,
      });

      if (!response.ok) {
        throw new TTSError(
          `Failed to list voices: ${response.status}`,
          this.provider,
          `HTTP_${response.status}`
        );
      }

      const data = (await response.json()) as { voices: ChatterboxVoice[] };

      return data.voices.map((voice) => ({
        id: voice.id,
        name: voice.name,
        language: voice.language || 'en-US',
        gender: voice.gender || 'neutral',
        description: voice.description,
        previewUrl: voice.preview_url,
      }));
    } catch (error) {
      if (error instanceof TTSError) {
        throw error;
      }
      throw new TTSError(
        `Failed to list voices: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.provider,
        'LIST_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Check if Chatterbox service is available.
   * @returns True if service is reachable and configured
   */
  async isAvailable(): Promise<boolean> {
    try {
      const headers: Record<string, string> = {};
      if (this.apiKey) {
        headers['Authorization'] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers,
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Estimate audio duration from buffer size.
   */
  private estimateAudioDuration(
    bufferSize: number,
    sampleRate: number,
    format: string
  ): number {
    // Rough estimation based on format
    const bytesPerSample = format === 'wav' ? 2 : 1;
    const seconds = bufferSize / (sampleRate * bytesPerSample);
    return Math.round(seconds * 1000);
  }

  /**
   * Get MIME type for audio format.
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/ogg',
      pcm: 'audio/pcm',
    };
    return mimeTypes[format] || 'audio/wav';
  }
}

/**
 * Internal type for Chatterbox API voice response.
 */
interface ChatterboxVoice {
  id: string;
  name: string;
  language?: string;
  gender?: 'male' | 'female' | 'neutral';
  description?: string;
  preview_url?: string;
}

/**
 * Create a Chatterbox TTS client from environment variables.
 * @returns Configured ChatterboxTTSClient
 * @throws TTSError if required configuration is missing
 */
export function createChatterboxClient(): ChatterboxTTSClient {
  const baseUrl = process.env.CHATTERBOX_API_URL;
  if (!baseUrl) {
    throw new TTSError(
      'CHATTERBOX_API_URL environment variable is required',
      'chatterbox',
      'MISSING_CONFIG'
    );
  }

  return new ChatterboxTTSClient({
    baseUrl,
    apiKey: process.env.CHATTERBOX_API_KEY,
    timeout: parseInt(process.env.CHATTERBOX_TIMEOUT ?? '30000', 10),
    defaultVoiceId: process.env.CHATTERBOX_DEFAULT_VOICE,
  });
}
