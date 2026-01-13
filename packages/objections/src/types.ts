// ===========================================
// Objection Types
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { ObjectionCategory } from '@underdog/core';

/**
 * Full objection definition
 */
export interface ObjectionDefinition {
  id: string;
  category: ObjectionCategory;
  text: string;
  variations: string[];
  suggestedResponses: SuggestedResponse[];
  difficulty: number; // 1-5
  tags: string[];
  frequency: 'common' | 'occasional' | 'rare';
}

/**
 * Suggested response to an objection
 */
export interface SuggestedResponse {
  id: string;
  technique: ResponseTechnique;
  response: string;
  explanation: string;
  effectiveness: number; // 1-5
}

/**
 * Response technique types
 */
export type ResponseTechnique =
  | 'acknowledge'    // Acknowledge the concern
  | 'clarify'        // Ask clarifying questions
  | 'reframe'        // Reframe the objection
  | 'provide_proof'  // Provide evidence/testimonials
  | 'feel_felt_found' // Classic technique
  | 'isolate'        // Isolate the objection
  | 'boomerang'      // Turn objection into benefit
  | 'postpone';      // Defer to later in conversation

/**
 * Objection match result
 */
export interface ObjectionMatch {
  objection: ObjectionDefinition;
  confidence: number; // 0-1
  matchedVariation?: string;
}

/**
 * Objection library statistics
 */
export interface ObjectionStats {
  totalObjections: number;
  byCategory: Record<ObjectionCategory, number>;
  byDifficulty: Record<number, number>;
  averageDifficulty: number;
}
