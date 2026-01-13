// ===========================================
// Persona Configuration Types
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Type definitions for AI prospect personas used in role-play.

import type { PersonalityType, MoodLevel, ObjectionCategory } from '@underdog/core';

/**
 * Voice configuration for a persona.
 */
export interface PersonaVoiceConfig {
  /** Voice ID for TTS synthesis */
  voiceId: string;
  /** Base speaking speed (0.5-2.0) */
  speed: number;
  /** Pitch adjustment (-1.0 to 1.0) */
  pitch: number;
}

/**
 * Behavioral traits that influence how the persona responds.
 */
export interface PersonaBehavior {
  /** How patient the persona is (affects interruption likelihood) */
  patience: number; // 0-1
  /** How direct vs. indirect responses are */
  directness: number; // 0-1
  /** Likelihood to ask clarifying questions */
  inquisitiveness: number; // 0-1
  /** Tendency to bring up objections proactively */
  proactiveObjections: number; // 0-1
  /** Speed at which trust is built or lost */
  trustVelocity: number; // 0-1
}

/**
 * Objection configuration for the persona.
 */
export interface PersonaObjections {
  /** Primary objection category */
  primaryCategory: ObjectionCategory;
  /** Specific objection IDs to use */
  enabledObjections: string[];
  /** How frequently objections are raised */
  frequency: 'low' | 'medium' | 'high';
  /** How persistent the persona is with objections */
  persistence: number; // 0-1, how many times they repeat objection
}

/**
 * Mood state management for the persona.
 */
export interface PersonaMood {
  /** Starting mood level */
  initial: MoodLevel;
  /** Lowest mood the persona can reach */
  floor: MoodLevel;
  /** Highest mood the persona can reach */
  ceiling: MoodLevel;
  /** Triggers that improve mood */
  positiveTriggers: string[];
  /** Triggers that worsen mood */
  negativeTriggers: string[];
}

/**
 * Industry-specific context for the persona.
 */
export interface PersonaIndustryContext {
  /** Industry vertical */
  industry: string;
  /** Company size category */
  companySize: 'startup' | 'smb' | 'midmarket' | 'enterprise';
  /** Specific challenges the persona faces */
  painPoints: string[];
  /** Current solutions they use */
  currentSolutions: string[];
  /** Budget constraints or focus */
  budgetContext?: string;
}

/**
 * Time constraints and availability patterns.
 */
export interface PersonaAvailability {
  /** How busy the persona typically is */
  busyLevel: 'low' | 'medium' | 'high' | 'extreme';
  /** Phrases used when trying to end calls */
  endCallPhrases: string[];
  /** Average call tolerance in seconds before wanting to end */
  callToleranceSeconds: number;
  /** Whether persona prefers scheduling callbacks */
  prefersCallback: boolean;
}

/**
 * Complete persona definition for AI role-play.
 */
export interface PersonaDefinition {
  /** Unique identifier */
  id: string;
  /** Display name */
  name: string;
  /** Role/title of the prospect */
  title: string;
  /** Company name (fictional) */
  company: string;
  /** Brief description for trainee context */
  description: string;

  /** Core personality type */
  personality: PersonalityType;
  /** Detailed behavioral traits */
  behavior: PersonaBehavior;
  /** Mood configuration */
  mood: PersonaMood;
  /** Voice synthesis configuration */
  voice: PersonaVoiceConfig;

  /** Industry and company context */
  industryContext: PersonaIndustryContext;
  /** Availability and time constraints */
  availability: PersonaAvailability;
  /** Objection handling configuration */
  objections: PersonaObjections;

  /** Custom response patterns for this persona */
  responsePatterns: PersonaResponsePattern[];
  /** Background context for the AI prompt */
  backgroundPrompt: string;
  /** Specific phrases or speech patterns to use */
  speechPatterns: string[];

  /** Difficulty rating (1-5) */
  difficulty: number;
  /** Training modules this persona is suited for */
  suitableForModules: number[];
  /** Tags for filtering/categorization */
  tags: string[];

  /** Creation and update timestamps */
  createdAt: string;
  updatedAt: string;
}

/**
 * Response pattern definition for specific situations.
 */
export interface PersonaResponsePattern {
  /** Trigger condition (keyword, intent, or situation) */
  trigger: string;
  /** Type of trigger */
  triggerType: 'keyword' | 'intent' | 'situation';
  /** Possible responses (one will be selected) */
  responses: string[];
  /** Mood effect when this pattern activates */
  moodEffect?: 'positive' | 'negative' | 'neutral';
  /** Priority (higher = checked first) */
  priority: number;
}

/**
 * Simplified persona for listing/selection.
 */
export interface PersonaSummary {
  id: string;
  name: string;
  title: string;
  company: string;
  description: string;
  personality: PersonalityType;
  difficulty: number;
  tags: string[];
}

/**
 * Runtime persona state during a conversation.
 */
export interface PersonaState {
  /** The base persona definition */
  persona: PersonaDefinition;
  /** Current mood level */
  currentMood: MoodLevel;
  /** Mood score (0-100 for granular tracking) */
  moodScore: number;
  /** Trust level built with trainee (0-100) */
  trustLevel: number;
  /** Objections already raised */
  raisedObjections: string[];
  /** Number of times trainee has been interrupted */
  interruptionCount: number;
  /** Whether persona is ready to end the call */
  wantsToEndCall: boolean;
  /** Conversation turn count */
  turnCount: number;
}

/**
 * Convert mood score (0-100) to mood level.
 */
export function scoreToMoodLevel(score: number): MoodLevel {
  if (score < 33) return 'low';
  if (score < 66) return 'medium';
  return 'high';
}

/**
 * Convert mood level to initial score.
 */
export function moodLevelToScore(level: MoodLevel): number {
  switch (level) {
    case 'low':
      return 25;
    case 'medium':
      return 50;
    case 'high':
      return 75;
  }
}

/**
 * Create initial persona state from a definition.
 */
export function createPersonaState(persona: PersonaDefinition): PersonaState {
  return {
    persona,
    currentMood: persona.mood.initial,
    moodScore: moodLevelToScore(persona.mood.initial),
    trustLevel: 20, // Start with low baseline trust
    raisedObjections: [],
    interruptionCount: 0,
    wantsToEndCall: false,
    turnCount: 0,
  };
}
