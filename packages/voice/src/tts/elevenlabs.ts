// ===========================================
// ElevenLabs TTS Client
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// ElevenLabs is a premium TTS provider with high-quality voices.
// Used as a fallback when Chatterbox is unavailable.

import {
  TTSService,
  TTSConfig,
  TTSResult,
  VoiceInfo,
  TTSError,
  VoiceEmotion,
} from '../types';

/**
 * Configuration for the ElevenLabs TTS client.
 */
export interface ElevenLabsConfig {
  /** ElevenLabs API key */
  apiKey: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Default voice ID to use */
  defaultVoiceId?: string;
  /** Model ID to use (e.g., 'eleven_turbo_v2') */
  modelId?: string;
}

/**
 * ElevenLabs API base URL.
 */
const ELEVENLABS_API_BASE = 'https://api.elevenlabs.io/v1';

/**
 * Emotion to ElevenLabs voice settings mapping.
 */
const EMOTION_SETTINGS: Record<VoiceEmotion, { stability: number; similarity: number; style: number }> = {
  neutral: { stability: 0.5, similarity: 0.75, style: 0.0 },
  skeptical: { stability: 0.6, similarity: 0.7, style: 0.4 },
  impatient: { stability: 0.4, similarity: 0.65, style: 0.6 },
  interested: { stability: 0.5, similarity: 0.8, style: 0.3 },
  annoyed: { stability: 0.35, similarity: 0.6, style: 0.7 },
  friendly: { stability: 0.55, similarity: 0.85, style: 0.2 },
  professional: { stability: 0.7, similarity: 0.75, style: 0.1 },
};

/**
 * ElevenLabs TTS client implementation.
 * Provides high-quality speech synthesis as a fallback option.
 */
export class ElevenLabsTTSClient implements TTSService {
  public readonly provider = 'elevenlabs';

  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly defaultVoiceId: string;
  private readonly modelId: string;

  constructor(config: ElevenLabsConfig) {
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.defaultVoiceId = config.defaultVoiceId ?? '21m00Tcm4TlvDq8ikWAM'; // Rachel voice
    this.modelId = config.modelId ?? 'eleven_turbo_v2';
  }

  /**
   * Synthesize text to speech using ElevenLabs.
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
    const emotionSettings = EMOTION_SETTINGS[emotion];

    const requestBody = {
      text: text.trim(),
      model_id: this.modelId,
      voice_settings: {
        stability: emotionSettings.stability,
        similarity_boost: emotionSettings.similarity,
        style: emotionSettings.style,
        use_speaker_boost: true,
      },
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const outputFormat = this.mapOutputFormat(config.outputFormat ?? 'mp3');
      const url = `${ELEVENLABS_API_BASE}/text-to-speech/${voiceId}?output_format=${outputFormat}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey,
        },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' })) as { detail?: { message?: string } | string };
        const errorMessage = typeof errorData.detail === 'string'
          ? errorData.detail
          : errorData.detail?.message ?? 'Unknown error';
        throw new TTSError(
          `ElevenLabs API error: ${response.status} - ${errorMessage}`,
          this.provider,
          `HTTP_${response.status}`
        );
      }

      const audioBuffer = Buffer.from(await response.arrayBuffer());

      // Get character count from response headers if available
      const charactersUsed = parseInt(
        response.headers.get('x-request-cost') ?? String(text.length),
        10
      );

      return {
        audio: audioBuffer,
        durationMs: this.estimateAudioDuration(audioBuffer.length, config.outputFormat ?? 'mp3'),
        mimeType: this.getMimeType(config.outputFormat ?? 'mp3'),
        charactersProcessed: charactersUsed,
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
   * List available voices from ElevenLabs.
   * @returns Array of available voice configurations
   */
  async listVoices(): Promise<VoiceInfo[]> {
    try {
      const response = await fetch(`${ELEVENLABS_API_BASE}/voices`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      if (!response.ok) {
        throw new TTSError(
          `Failed to list voices: ${response.status}`,
          this.provider,
          `HTTP_${response.status}`
        );
      }

      const data = (await response.json()) as { voices: ElevenLabsVoice[] };

      return data.voices.map((voice) => ({
        id: voice.voice_id,
        name: voice.name,
        language: voice.labels?.language ?? 'en',
        gender: this.mapGender(voice.labels?.gender),
        description: voice.description ?? voice.labels?.description,
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
   * Check if ElevenLabs service is available.
   * @returns True if API key is valid and service is reachable
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${ELEVENLABS_API_BASE}/user`, {
        method: 'GET',
        headers: {
          'xi-api-key': this.apiKey,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Map output format to ElevenLabs format string.
   */
  private mapOutputFormat(format: string): string {
    const formatMap: Record<string, string> = {
      mp3: 'mp3_44100_128',
      wav: 'pcm_44100',
      ogg: 'mp3_44100_128', // ElevenLabs doesn't support ogg, fallback to mp3
      pcm: 'pcm_44100',
    };
    return formatMap[format] || 'mp3_44100_128';
  }

  /**
   * Get MIME type for audio format.
   */
  private getMimeType(format: string): string {
    const mimeTypes: Record<string, string> = {
      mp3: 'audio/mpeg',
      wav: 'audio/wav',
      ogg: 'audio/mpeg', // Fallback since we convert to mp3
      pcm: 'audio/pcm',
    };
    return mimeTypes[format] || 'audio/mpeg';
  }

  /**
   * Estimate audio duration from buffer size.
   */
  private estimateAudioDuration(bufferSize: number, format: string): number {
    // Rough estimation: ~128kbps for mp3, ~1411kbps for wav
    const bitrateKbps = format === 'wav' || format === 'pcm' ? 1411 : 128;
    const seconds = (bufferSize * 8) / (bitrateKbps * 1000);
    return Math.round(seconds * 1000);
  }

  /**
   * Map ElevenLabs gender label to standard gender type.
   */
  private mapGender(gender?: string): 'male' | 'female' | 'neutral' {
    if (!gender) return 'neutral';
    const normalized = gender.toLowerCase();
    if (normalized.includes('male') && !normalized.includes('female')) return 'male';
    if (normalized.includes('female')) return 'female';
    return 'neutral';
  }
}

/**
 * Internal type for ElevenLabs API voice response.
 */
interface ElevenLabsVoice {
  voice_id: string;
  name: string;
  description?: string;
  preview_url?: string;
  labels?: {
    language?: string;
    gender?: string;
    description?: string;
    accent?: string;
  };
}

/**
 * Create an ElevenLabs TTS client from environment variables.
 * @returns Configured ElevenLabsTTSClient
 * @throws TTSError if required configuration is missing
 */
export function createElevenLabsClient(): ElevenLabsTTSClient {
  const apiKey = process.env.ELEVENLABS_API_KEY;
  if (!apiKey) {
    throw new TTSError(
      'ELEVENLABS_API_KEY environment variable is required',
      'elevenlabs',
      'MISSING_CONFIG'
    );
  }

  return new ElevenLabsTTSClient({
    apiKey,
    timeout: parseInt(process.env.ELEVENLABS_TIMEOUT ?? '30000', 10),
    defaultVoiceId: process.env.ELEVENLABS_DEFAULT_VOICE,
    modelId: process.env.ELEVENLABS_MODEL_ID,
  });
}
