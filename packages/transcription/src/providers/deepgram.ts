// ===========================================
// Deepgram Transcription Client
// ===========================================
// Owner: Stream 5 (Call Recordings)

import type {
  TranscriptionClient,
  TranscriptionRequest,
  TranscriptionResult,
  TranscriptSegment,
} from '../types';
import { generateId } from '@underdog/core';

/**
 * Deepgram configuration
 */
export interface DeepgramConfig {
  apiKey: string;
  model?: string;
  tier?: 'base' | 'enhanced';
}

/**
 * Deepgram transcription client
 */
export class DeepgramTranscriptionClient implements TranscriptionClient {
  readonly provider = 'deepgram' as const;
  private readonly apiKey: string;
  private readonly model: string;
  private readonly baseUrl = 'https://api.deepgram.com/v1';

  constructor(config: DeepgramConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model ?? 'nova-2';
  }

  async transcribe(request: TranscriptionRequest): Promise<TranscriptionResult> {
    const params = new URLSearchParams({
      model: this.model,
      language: request.language ?? 'en',
      punctuate: String(request.punctuation ?? true),
      diarize: String(request.diarization ?? true),
      utterances: 'true',
      smart_format: 'true',
    });

    const response = await fetch(
      `${this.baseUrl}/listen?${params}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Token ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: request.audioUrl }),
      }
    );

    if (!response.ok) {
      throw new Error(`Deepgram API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseResponse(data);
  }

  async isAvailable(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/projects`, {
        headers: { Authorization: `Token ${this.apiKey}` },
      });
      return response.ok;
    } catch {
      return false;
    }
  }

  private parseResponse(data: any): TranscriptionResult {
    const result = data.results?.channels?.[0]?.alternatives?.[0];
    const utterances = data.results?.utterances ?? [];

    const segments: TranscriptSegment[] = utterances.map((u: any, idx: number) => ({
      id: generateId(),
      speaker: `Speaker ${u.speaker ?? idx + 1}`,
      text: u.transcript,
      startTime: u.start,
      endTime: u.end,
      confidence: u.confidence,
      words: u.words?.map((w: any) => ({
        word: w.word,
        startTime: w.start,
        endTime: w.end,
        confidence: w.confidence,
      })),
    }));

    return {
      transcriptId: generateId(),
      text: result?.transcript ?? '',
      segments,
      confidence: result?.confidence ?? 0,
      durationSeconds: data.metadata?.duration ?? 0,
      language: data.metadata?.language ?? 'en',
      provider: 'deepgram',
      processedAt: new Date(),
    };
  }
}

/**
 * Create Deepgram client from environment
 */
export function createDeepgramTranscriptionClient(): DeepgramTranscriptionClient | null {
  const apiKey = process.env.DEEPGRAM_API_KEY;
  if (!apiKey) return null;

  return new DeepgramTranscriptionClient({
    apiKey,
    model: process.env.DEEPGRAM_MODEL,
  });
}
