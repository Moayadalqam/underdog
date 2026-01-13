// ===========================================
// AI Orchestrator - Claude API Integration
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Manages AI interactions for prospect simulation and feedback.

import Anthropic from '@anthropic-ai/sdk';
import type { TranscriptSegment } from '@underdog/core';
import type {
  PersonaDefinition,
  PersonaState,
} from './personas/types';
import {
  createPersonaState,
  scoreToMoodLevel,
} from './personas/types';
import {
  generateProspectSystemPrompt,
  buildConversationMessages,
  generateOpeningPrompt,
} from './prompts/prospect';
import {
  generateFeedbackSystemPrompt,
  formatFeedbackRequest,
  parseFeedbackResponse,
  detectFillerWords,
  generateFillerWordFeedback,
  type FeedbackContext,
  type FeedbackItem,
  type FeedbackCategory,
} from './prompts/feedback';

/**
 * Configuration for the AI Orchestrator.
 */
export interface OrchestratorConfig {
  /** Anthropic API key */
  apiKey: string;
  /** Model to use for prospect simulation */
  prospectModel?: string;
  /** Model to use for feedback generation */
  feedbackModel?: string;
  /** Maximum tokens for prospect responses */
  maxProspectTokens?: number;
  /** Maximum tokens for feedback responses */
  maxFeedbackTokens?: number;
  /** Enable feedback generation during conversation */
  enableFeedback?: boolean;
}

/**
 * Result from a conversation turn.
 */
export interface ConversationTurnResult {
  /** The prospect's response */
  prospectResponse: string;
  /** Updated persona state */
  state: PersonaState;
  /** Real-time feedback items */
  feedback: FeedbackItem[];
  /** Token usage for this turn */
  usage: {
    inputTokens: number;
    outputTokens: number;
  };
}

/**
 * Conversation history entry.
 */
export interface ConversationEntry {
  role: 'trainee' | 'prospect';
  content: string;
  timestamp: number;
}

/**
 * AI Orchestrator for managing role-play conversations.
 */
export class AIOrchestrator {
  private readonly client: Anthropic;
  private readonly prospectModel: string;
  private readonly feedbackModel: string;
  private readonly maxProspectTokens: number;
  private readonly maxFeedbackTokens: number;
  private readonly enableFeedback: boolean;

  constructor(config: OrchestratorConfig) {
    this.client = new Anthropic({ apiKey: config.apiKey });
    this.prospectModel = config.prospectModel ?? 'claude-sonnet-4-20250514';
    this.feedbackModel = config.feedbackModel ?? 'claude-sonnet-4-20250514';
    this.maxProspectTokens = config.maxProspectTokens ?? 150;
    this.maxFeedbackTokens = config.maxFeedbackTokens ?? 500;
    this.enableFeedback = config.enableFeedback ?? true;
  }

  /**
   * Start a new role-play conversation.
   * @param persona - The persona to simulate
   * @returns Initial state and opening line
   */
  async startConversation(
    persona: PersonaDefinition
  ): Promise<{ state: PersonaState; opening: string }> {
    const state = createPersonaState(persona);
    const opening = generateOpeningPrompt(persona);

    return { state, opening };
  }

  /**
   * Process a trainee message and generate prospect response.
   * @param traineeMessage - What the trainee said
   * @param persona - The persona being simulated
   * @param state - Current persona state
   * @param history - Conversation history
   * @param feedbackContext - Optional feedback context
   * @returns Conversation turn result
   */
  async processMessage(
    traineeMessage: string,
    persona: PersonaDefinition,
    state: PersonaState,
    history: ConversationEntry[],
    feedbackContext?: Partial<FeedbackContext>
  ): Promise<ConversationTurnResult> {
    // Update state for new turn
    const updatedState = {
      ...state,
      turnCount: state.turnCount + 1,
    };

    // Generate prospect response
    const { response, usage: prospectUsage } = await this.generateProspectResponse(
      traineeMessage,
      persona,
      updatedState,
      history
    );

    // Update mood and trust based on interaction
    const stateAfterResponse = this.updatePersonaState(
      updatedState,
      traineeMessage,
      response,
      persona
    );

    // Generate feedback if enabled
    let feedback: FeedbackItem[] = [];
    let feedbackUsage = { inputTokens: 0, outputTokens: 0 };

    if (this.enableFeedback) {
      const feedbackResult = await this.generateFeedback(
        traineeMessage,
        response,
        stateAfterResponse,
        history,
        feedbackContext
      );
      feedback = feedbackResult.feedback;
      feedbackUsage = feedbackResult.usage;
    }

    return {
      prospectResponse: response,
      state: stateAfterResponse,
      feedback,
      usage: {
        inputTokens: prospectUsage.inputTokens + feedbackUsage.inputTokens,
        outputTokens: prospectUsage.outputTokens + feedbackUsage.outputTokens,
      },
    };
  }

  /**
   * Generate prospect response using Claude.
   */
  private async generateProspectResponse(
    traineeMessage: string,
    persona: PersonaDefinition,
    state: PersonaState,
    history: ConversationEntry[]
  ): Promise<{ response: string; usage: { inputTokens: number; outputTokens: number } }> {
    const systemPrompt = generateProspectSystemPrompt(persona, state);

    const formattedHistory = history.map((entry) => ({
      role: entry.role,
      content: entry.content,
    }));

    const messages = buildConversationMessages(
      persona,
      state,
      formattedHistory,
      traineeMessage
    );

    try {
      const response = await this.client.messages.create({
        model: this.prospectModel,
        max_tokens: this.maxProspectTokens,
        system: systemPrompt,
        messages,
      });

      const textContent = response.content.find((c) => c.type === 'text');
      const responseText = textContent?.type === 'text' ? textContent.text : '';

      return {
        response: responseText.trim(),
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      throw new AIOrchestrationError(
        `Failed to generate prospect response: ${error instanceof Error ? error.message : 'Unknown error'}`,
        'PROSPECT_GENERATION_FAILED',
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Generate feedback for the trainee's message.
   */
  private async generateFeedback(
    traineeMessage: string,
    prospectResponse: string,
    state: PersonaState,
    history: ConversationEntry[],
    contextOverrides?: Partial<FeedbackContext>
  ): Promise<{ feedback: FeedbackItem[]; usage: { inputTokens: number; outputTokens: number } }> {
    // Build transcript segments from history
    const segments: TranscriptSegment[] = history.map((entry, i) => ({
      speaker: entry.role === 'trainee' ? 'trainee' : 'ai',
      text: entry.content,
      startTime: i * 10, // Approximate timing
      endTime: (i + 1) * 10,
      confidence: 1.0,
    }));

    const context: FeedbackContext = {
      focusAreas: contextOverrides?.focusAreas ?? [],
      skillLevel: contextOverrides?.skillLevel ?? 'intermediate',
      recentSegments: segments,
      turnNumber: state.turnCount,
      prospectMoodScore: state.moodScore,
      trustLevel: state.trustLevel,
      moduleId: contextOverrides?.moduleId,
    };

    const systemPrompt = generateFeedbackSystemPrompt(context);
    const userMessage = formatFeedbackRequest(traineeMessage, prospectResponse, context);

    try {
      const response = await this.client.messages.create({
        model: this.feedbackModel,
        max_tokens: this.maxFeedbackTokens,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });

      const textContent = response.content.find((c) => c.type === 'text');
      const responseText = textContent?.type === 'text' ? textContent.text : '';

      let feedback = parseFeedbackResponse(responseText);

      // Add filler word detection (local, no API call)
      const fillerCounts = detectFillerWords(traineeMessage);
      const fillerFeedback = generateFillerWordFeedback(fillerCounts, traineeMessage.length);
      if (fillerFeedback) {
        feedback.push(fillerFeedback);
      }

      return {
        feedback,
        usage: {
          inputTokens: response.usage.input_tokens,
          outputTokens: response.usage.output_tokens,
        },
      };
    } catch (error) {
      // Feedback generation is non-critical - return empty on failure
      console.warn('Feedback generation failed:', error);
      return {
        feedback: [],
        usage: { inputTokens: 0, outputTokens: 0 },
      };
    }
  }

  /**
   * Update persona state based on the interaction.
   */
  private updatePersonaState(
    state: PersonaState,
    traineeMessage: string,
    prospectResponse: string,
    persona: PersonaDefinition
  ): PersonaState {
    const newState = { ...state };

    // Analyze trainee message for mood triggers
    const lowerMessage = traineeMessage.toLowerCase();

    // Check positive triggers
    let moodDelta = 0;
    for (const trigger of persona.mood.positiveTriggers) {
      if (lowerMessage.includes(trigger.toLowerCase())) {
        moodDelta += 5;
      }
    }

    // Check negative triggers
    for (const trigger of persona.mood.negativeTriggers) {
      if (lowerMessage.includes(trigger.toLowerCase())) {
        moodDelta -= 5;
      }
    }

    // Apply trust velocity
    const trustVelocity = persona.behavior.trustVelocity;
    if (moodDelta > 0) {
      newState.trustLevel = Math.min(100, newState.trustLevel + moodDelta * trustVelocity);
    } else if (moodDelta < 0) {
      newState.trustLevel = Math.max(0, newState.trustLevel + moodDelta * trustVelocity);
    }

    // Update mood with bounds
    const moodFloor = moodLevelToScore(persona.mood.floor);
    const moodCeiling = moodLevelToScore(persona.mood.ceiling);
    newState.moodScore = Math.max(moodFloor, Math.min(moodCeiling, newState.moodScore + moodDelta));
    newState.currentMood = scoreToMoodLevel(newState.moodScore);

    // Check if wants to end call (based on turn count and availability)
    if (
      persona.availability.busyLevel === 'extreme' &&
      newState.turnCount > 3
    ) {
      newState.wantsToEndCall = true;
    } else if (
      persona.availability.busyLevel === 'high' &&
      newState.turnCount > 6
    ) {
      newState.wantsToEndCall = newState.moodScore < 50;
    }

    return newState;
  }
}

/**
 * Convert mood level to score.
 */
function moodLevelToScore(level: string): number {
  switch (level) {
    case 'low':
      return 25;
    case 'medium':
      return 50;
    case 'high':
      return 75;
    default:
      return 50;
  }
}

/**
 * Error class for AI orchestration failures.
 */
export class AIOrchestrationError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly cause?: Error
  ) {
    super(message);
    this.name = 'AIOrchestrationError';
  }
}

/**
 * Create an AI Orchestrator from environment variables.
 * @returns Configured AIOrchestrator
 * @throws AIOrchestrationError if required configuration is missing
 */
export function createOrchestrator(): AIOrchestrator {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new AIOrchestrationError(
      'ANTHROPIC_API_KEY environment variable is required',
      'MISSING_CONFIG'
    );
  }

  return new AIOrchestrator({
    apiKey,
    prospectModel: process.env.AI_PROSPECT_MODEL,
    feedbackModel: process.env.AI_FEEDBACK_MODEL,
    maxProspectTokens: parseInt(process.env.AI_MAX_PROSPECT_TOKENS ?? '150', 10),
    maxFeedbackTokens: parseInt(process.env.AI_MAX_FEEDBACK_TOKENS ?? '500', 10),
    enableFeedback: process.env.AI_ENABLE_FEEDBACK !== 'false',
  });
}
