// ===========================================
// Deepgram STT Client
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Deepgram provides real-time speech-to-text with
// high accuracy and low latency, ideal for live conversations.

import {
  STTService,
  STTConfig,
  STTResult,
  STTStreamController,
  STTStreamCallback,
  STTStreamEvent,
  STTError,
  TranscriptWord,
} from '../types';

/**
 * Configuration for the Deepgram STT client.
 */
export interface DeepgramConfig {
  /** Deepgram API key */
  apiKey: string;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** Default model to use */
  model?: string;
  /** Deepgram tier (nova-2, enhanced, base) */
  tier?: string;
}

/**
 * Deepgram API base URL.
 */
const DEEPGRAM_API_BASE = 'https://api.deepgram.com/v1';

/**
 * Deepgram STT client implementation.
 * Provides real-time transcription for role-play conversations.
 */
export class DeepgramSTTClient implements STTService {
  public readonly provider = 'deepgram';

  private readonly apiKey: string;
  private readonly timeout: number;
  private readonly model: string;
  private readonly tier: string;

  constructor(config: DeepgramConfig) {
    this.apiKey = config.apiKey;
    this.timeout = config.timeout ?? 30000;
    this.model = config.model ?? 'nova-2';
    this.tier = config.tier ?? 'nova';
  }

  /**
   * Transcribe audio from a buffer.
   * @param audio - Audio data buffer
   * @param config - Transcription configuration
   * @returns Transcription result
   */
  async transcribe(audio: Buffer, config?: STTConfig): Promise<STTResult> {
    if (!audio || audio.length === 0) {
      throw new STTError('Audio buffer cannot be empty', this.provider, 'EMPTY_AUDIO');
    }

    const queryParams = this.buildQueryParams(config);
    const url = `${DEEPGRAM_API_BASE}/listen?${queryParams.toString()}`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
          'Content-Type': this.getContentType(config?.encoding),
        },
        body: audio,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ err_msg: 'Unknown error' })) as DeepgramError;
        throw new STTError(
          `Deepgram API error: ${response.status} - ${errorData.err_msg}`,
          this.provider,
          `HTTP_${response.status}`
        );
      }

      const data = (await response.json()) as DeepgramResponse;
      return this.parseResponse(data);
    } catch (error) {
      if (error instanceof STTError) {
        throw error;
      }
      if (error instanceof Error && error.name === 'AbortError') {
        throw new STTError('Request timeout', this.provider, 'TIMEOUT', error);
      }
      throw new STTError(
        `Failed to transcribe audio: ${error instanceof Error ? error.message : 'Unknown error'}`,
        this.provider,
        'TRANSCRIPTION_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Start a streaming transcription session.
   * @param config - Transcription configuration
   * @param callback - Callback for streaming events
   * @returns Stream controller for managing the session
   */
  startStream(config: STTConfig, callback: STTStreamCallback): STTStreamController {
    const queryParams = this.buildQueryParams(config);
    const wsUrl = `wss://api.deepgram.com/v1/listen?${queryParams.toString()}`;

    // Create WebSocket connection
    // Note: In production, use a WebSocket library that supports auth headers (e.g., ws)
    // For browser, pass the token via query parameter instead
    const wsUrlWithAuth = `${wsUrl}&token=${this.apiKey}`;
    const ws = new WebSocket(wsUrlWithAuth);

    let isActive = true;
    let keepAliveInterval: ReturnType<typeof setInterval> | null = null;

    // Set up authorization header via protocol header (Deepgram-specific)
    // In production, use a proper WebSocket library that supports headers

    ws.onopen = () => {
      // Start keep-alive ping
      keepAliveInterval = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'KeepAlive' }));
        }
      }, 10000);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as DeepgramStreamResponse;

        if (data.type === 'Results') {
          const result = this.parseStreamResult(data);
          const eventType: 'interim' | 'final' = result.isFinal ? 'final' : 'interim';
          callback({ type: eventType, result });
        }
      } catch (error) {
        callback({
          type: 'error',
          error: new Error(`Failed to parse response: ${error instanceof Error ? error.message : 'Unknown'}`),
        });
      }
    };

    ws.onerror = (error) => {
      isActive = false;
      callback({
        type: 'error',
        error: new Error(`WebSocket error: ${error}`),
      });
    };

    ws.onclose = () => {
      isActive = false;
      if (keepAliveInterval) {
        clearInterval(keepAliveInterval);
      }
      callback({ type: 'close' });
    };

    return {
      write(audio: Buffer): void {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(audio);
        }
      },

      end(): void {
        if (ws.readyState === WebSocket.OPEN) {
          // Send close stream message
          ws.send(JSON.stringify({ type: 'CloseStream' }));
        }
      },

      abort(): void {
        isActive = false;
        if (keepAliveInterval) {
          clearInterval(keepAliveInterval);
        }
        ws.close();
      },

      get isActive(): boolean {
        return isActive && ws.readyState === WebSocket.OPEN;
      },
    };
  }

  /**
   * Check if Deepgram service is available.
   * @returns True if API key is valid and service is reachable
   */
  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${DEEPGRAM_API_BASE}/projects`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${this.apiKey}`,
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Build query parameters for Deepgram API.
   */
  private buildQueryParams(config?: STTConfig): URLSearchParams {
    const params = new URLSearchParams({
      model: this.model,
      tier: this.tier,
      smart_format: 'true',
      diarize: 'false',
    });

    if (config?.language) {
      params.set('language', config.language);
    }

    if (config?.punctuate !== undefined) {
      params.set('punctuate', String(config.punctuate));
    }

    if (config?.profanityFilter) {
      params.set('profanity_filter', 'true');
    }

    if (config?.keywords && config.keywords.length > 0) {
      config.keywords.forEach((keyword) => {
        params.append('keywords', keyword);
      });
    }

    if (config?.sampleRate) {
      params.set('sample_rate', String(config.sampleRate));
    }

    if (config?.channels) {
      params.set('channels', String(config.channels));
    }

    if (config?.encoding) {
      params.set('encoding', config.encoding);
    }

    return params;
  }

  /**
   * Get content type for audio encoding.
   */
  private getContentType(encoding?: string): string {
    const contentTypes: Record<string, string> = {
      linear16: 'audio/l16',
      mp3: 'audio/mpeg',
      opus: 'audio/opus',
      webm: 'audio/webm',
    };
    return contentTypes[encoding ?? 'linear16'] ?? 'audio/l16';
  }

  /**
   * Parse Deepgram batch response into STTResult.
   */
  private parseResponse(data: DeepgramResponse): STTResult {
    const channel = data.results?.channels?.[0];
    const alternative = channel?.alternatives?.[0];

    if (!alternative) {
      return {
        transcript: '',
        confidence: 0,
        words: [],
        durationSeconds: data.metadata?.duration ?? 0,
        isFinal: true,
      };
    }

    const words: TranscriptWord[] = (alternative.words ?? []).map((word) => ({
      word: word.word,
      start: word.start,
      end: word.end,
      confidence: word.confidence,
      speakerChange: word.speaker !== undefined,
    }));

    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      words,
      durationSeconds: data.metadata?.duration ?? 0,
      isFinal: true,
    };
  }

  /**
   * Parse Deepgram streaming response into STTResult.
   */
  private parseStreamResult(data: DeepgramStreamResponse): STTResult {
    const channel = data.channel;
    const alternative = channel?.alternatives?.[0];

    if (!alternative) {
      return {
        transcript: '',
        confidence: 0,
        words: [],
        durationSeconds: data.duration ?? 0,
        isFinal: data.is_final ?? false,
      };
    }

    const words: TranscriptWord[] = (alternative.words ?? []).map((word) => ({
      word: word.word,
      start: word.start,
      end: word.end,
      confidence: word.confidence,
    }));

    return {
      transcript: alternative.transcript,
      confidence: alternative.confidence,
      words,
      durationSeconds: data.duration ?? 0,
      isFinal: data.is_final ?? false,
    };
  }
}

// ----- Internal Types -----

interface DeepgramError {
  err_code?: string;
  err_msg: string;
}

interface DeepgramWord {
  word: string;
  start: number;
  end: number;
  confidence: number;
  speaker?: number;
}

interface DeepgramAlternative {
  transcript: string;
  confidence: number;
  words?: DeepgramWord[];
}

interface DeepgramChannel {
  alternatives: DeepgramAlternative[];
}

interface DeepgramResponse {
  metadata?: {
    duration?: number;
    channels?: number;
  };
  results?: {
    channels?: DeepgramChannel[];
  };
}

interface DeepgramStreamResponse {
  type: string;
  channel?: {
    alternatives: DeepgramAlternative[];
  };
  duration?: number;
  is_final?: boolean;
}

/**
 * Create a Deepgram STT client from environment variables.
 * @returns Configured DeepgramSTTClient
 * @throws STTError if required configuration is missing
 */
export function createDeepgramClient(): DeepgramSTTClient {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) {
    throw new STTError(
      'DEEPGRAM_API_KEY environment variable is required',
      'deepgram',
      'MISSING_CONFIG'
    );
  }

  return new DeepgramSTTClient({
    apiKey,
    timeout: parseInt(process.env.DEEPGRAM_TIMEOUT ?? '30000', 10),
    model: process.env.DEEPGRAM_MODEL,
    tier: process.env.DEEPGRAM_TIER,
  });
}
