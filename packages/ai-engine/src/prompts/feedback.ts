// ===========================================
// Real-Time Feedback Prompts
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// Prompts for generating real-time coaching feedback during role-play.

import type { TranscriptSegment } from '@underdog/core';

/**
 * Categories of feedback that can be provided.
 */
export type FeedbackCategory =
  | 'opening'
  | 'rapport'
  | 'discovery'
  | 'value_proposition'
  | 'objection_handling'
  | 'closing'
  | 'tone'
  | 'pace'
  | 'filler_words';

/**
 * Severity levels for feedback items.
 */
export type FeedbackSeverity = 'positive' | 'suggestion' | 'warning' | 'critical';

/**
 * A single piece of feedback.
 */
export interface FeedbackItem {
  category: FeedbackCategory;
  severity: FeedbackSeverity;
  message: string;
  suggestion?: string;
  timestamp?: number;
  relatedText?: string;
}

/**
 * Context for generating feedback.
 */
export interface FeedbackContext {
  /** Current module being practiced */
  moduleId?: string;
  /** Focus areas for this session */
  focusAreas: FeedbackCategory[];
  /** Skill level of the trainee */
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  /** Recent transcript segments */
  recentSegments: TranscriptSegment[];
  /** Current conversation turn number */
  turnNumber: number;
  /** Current prospect mood score (0-100) */
  prospectMoodScore: number;
  /** Trust level with prospect (0-100) */
  trustLevel: number;
}

/**
 * Generate the system prompt for real-time feedback analysis.
 */
export function generateFeedbackSystemPrompt(context: FeedbackContext): string {
  const focusAreasText = context.focusAreas.length > 0
    ? `Focus your feedback on: ${context.focusAreas.join(', ')}`
    : 'Provide general cold calling feedback';

  const skillLevelGuidance = getSkillLevelGuidance(context.skillLevel);

  return `You are an expert cold calling coach providing real-time feedback during a training session. Your feedback should be concise, actionable, and encouraging.

## Your Role

Analyze the trainee's latest message and provide targeted coaching feedback. Focus on specific, actionable improvements rather than general observations.

## Skill Level: ${context.skillLevel}
${skillLevelGuidance}

## Current Session Context

- Turn Number: ${context.turnNumber}
- Prospect Mood: ${getMoodDescription(context.prospectMoodScore)}
- Trust Level: ${getTrustDescription(context.trustLevel)}
${context.moduleId ? `- Training Module: ${context.moduleId}` : ''}

## Focus Areas
${focusAreasText}

## Feedback Guidelines

1. **Be Specific** - Reference exact phrases or behaviors
2. **Be Actionable** - Provide clear suggestions for improvement
3. **Be Timely** - Focus on immediate improvements
4. **Be Balanced** - Acknowledge what's working well
5. **Be Brief** - Each feedback item should be 1-2 sentences

## Feedback Categories

- **opening**: How well the trainee introduces themselves and establishes interest
- **rapport**: Building connection and demonstrating understanding
- **discovery**: Asking questions to understand prospect needs
- **value_proposition**: Clearly communicating benefits relevant to prospect
- **objection_handling**: Addressing concerns and pushback effectively
- **closing**: Moving toward next steps appropriately
- **tone**: Voice quality, enthusiasm, confidence
- **pace**: Speaking speed and natural flow
- **filler_words**: "Um", "uh", "like", "you know" usage

## Output Format

Respond with a JSON array of feedback items. Each item should have:
- category: one of the categories above
- severity: "positive", "suggestion", "warning", or "critical"
- message: the feedback message
- suggestion: (optional) specific improvement suggestion

Example:
\`\`\`json
[
  {
    "category": "opening",
    "severity": "positive",
    "message": "Great permission-based opener - asking if they have a moment shows respect for their time."
  },
  {
    "category": "pace",
    "severity": "suggestion",
    "message": "Your delivery was a bit rushed in the value proposition.",
    "suggestion": "Try pausing briefly after stating each benefit to let it land."
  }
]
\`\`\`

Provide 1-3 feedback items per turn. Only include feedback that is truly relevant and actionable.`;
}

/**
 * Get skill level specific coaching guidance.
 */
function getSkillLevelGuidance(level: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (level) {
    case 'beginner':
      return `For beginners:
- Focus on foundational skills (opening, basic structure)
- Be encouraging and patient
- Prioritize one improvement at a time
- Provide examples when suggesting changes`;

    case 'intermediate':
      return `For intermediate learners:
- Push for more nuanced improvements
- Focus on handling objections and discovery
- Expect proper structure but refine execution
- Challenge them to adapt to prospect cues`;

    case 'advanced':
      return `For advanced practitioners:
- Hold to high standards
- Focus on subtle improvements
- Analyze strategic choices
- Push for mastery-level execution`;
  }
}

/**
 * Get mood description for context.
 */
function getMoodDescription(score: number): string {
  if (score < 30) return 'Negative - trainee is losing them';
  if (score < 50) return 'Cool - trainee needs to build rapport';
  if (score < 70) return 'Neutral - there is an opportunity to warm them up';
  return 'Positive - trainee is building good connection';
}

/**
 * Get trust description for context.
 */
function getTrustDescription(level: number): string {
  if (level < 30) return 'Low - prospect is guarded';
  if (level < 50) return 'Building - prospect is evaluating';
  if (level < 70) return 'Established - prospect is engaged';
  return 'Strong - prospect is receptive';
}

/**
 * Generate user message for feedback analysis.
 */
export function formatFeedbackRequest(
  traineeMessage: string,
  prospectResponse: string,
  context: FeedbackContext
): string {
  const recentContext = context.recentSegments
    .slice(-4)
    .map((s) => `${s.speaker}: "${s.text}"`)
    .join('\n');

  return `## Recent Conversation
${recentContext}

## Latest Exchange
Trainee: "${traineeMessage}"
Prospect: "${prospectResponse}"

## Analysis Request
Analyze the trainee's message and provide coaching feedback. Consider:
1. How effective was their response given the prospect's current mood?
2. Did they address any concerns or objections appropriately?
3. What could they do better on their next turn?

Provide your feedback as a JSON array.`;
}

/**
 * Parse feedback response from Claude.
 */
export function parseFeedbackResponse(response: string): FeedbackItem[] {
  try {
    // Extract JSON from response (might be wrapped in markdown code blocks)
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    const jsonStr = jsonMatch ? jsonMatch[1].trim() : response.trim();

    const parsed = JSON.parse(jsonStr);

    if (!Array.isArray(parsed)) {
      return [];
    }

    // Validate and type each item
    return parsed
      .filter((item): item is FeedbackItem => {
        return (
          typeof item === 'object' &&
          item !== null &&
          typeof item.category === 'string' &&
          typeof item.severity === 'string' &&
          typeof item.message === 'string'
        );
      })
      .map((item) => ({
        category: item.category as FeedbackCategory,
        severity: item.severity as FeedbackSeverity,
        message: item.message,
        suggestion: item.suggestion,
        timestamp: item.timestamp,
        relatedText: item.relatedText,
      }));
  } catch {
    // If parsing fails, return empty array
    return [];
  }
}

/**
 * Common filler words to detect.
 */
const FILLER_WORDS = [
  'um', 'uh', 'like', 'you know', 'basically', 'actually',
  'literally', 'sort of', 'kind of', 'i mean', 'right',
];

/**
 * Analyze text for filler words.
 * @param text - Text to analyze
 * @returns Object with filler word counts
 */
export function detectFillerWords(text: string): Record<string, number> {
  const lowerText = text.toLowerCase();
  const counts: Record<string, number> = {};

  for (const filler of FILLER_WORDS) {
    const regex = new RegExp(`\\b${filler}\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches && matches.length > 0) {
      counts[filler] = matches.length;
    }
  }

  return counts;
}

/**
 * Generate feedback for excessive filler words.
 */
export function generateFillerWordFeedback(
  fillerCounts: Record<string, number>,
  messageLength: number
): FeedbackItem | null {
  const totalFillers = Object.values(fillerCounts).reduce((a, b) => a + b, 0);
  const fillerDensity = totalFillers / (messageLength / 100); // per 100 chars

  if (fillerDensity < 0.5) {
    return null; // Acceptable level
  }

  const topFillers = Object.entries(fillerCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([word]) => `"${word}"`)
    .join(' and ');

  const severity: FeedbackSeverity = fillerDensity > 1.5 ? 'warning' : 'suggestion';

  return {
    category: 'filler_words',
    severity,
    message: `Noticed frequent use of ${topFillers}. These can undermine your credibility.`,
    suggestion: 'Try pausing silently instead of using filler words. It actually sounds more confident.',
  };
}
