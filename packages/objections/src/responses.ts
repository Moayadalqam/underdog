// ===========================================
// Response Templates
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { ResponseTechnique, SuggestedResponse } from './types';

/**
 * Response technique descriptions
 */
export const TECHNIQUE_DESCRIPTIONS: Record<ResponseTechnique, string> = {
  acknowledge: 'Acknowledge the concern to show you understand',
  clarify: 'Ask questions to better understand the objection',
  reframe: 'Reframe the objection in a positive light',
  provide_proof: 'Provide evidence, case studies, or testimonials',
  feel_felt_found: 'Use the classic "I understand how you feel..." technique',
  isolate: 'Isolate the objection to address it directly',
  boomerang: 'Turn the objection into a reason to buy',
  postpone: 'Acknowledge and suggest addressing it later',
};

/**
 * Template responses by technique
 */
export const RESPONSE_TEMPLATES: Record<ResponseTechnique, string[]> = {
  acknowledge: [
    'I completely understand your concern about {objection}.',
    'That\'s a valid point, and many of our clients initially felt the same way.',
    'I appreciate you being upfront about that.',
  ],
  clarify: [
    'Help me understand - when you say {objection}, what specifically concerns you?',
    'Can you tell me more about what\'s driving that concern?',
    'Is it the {aspect} that\'s the main issue, or something else?',
  ],
  reframe: [
    'What if I told you that {objection} could actually be an advantage?',
    'Looking at it differently, {reframe}.',
    'That\'s exactly why {benefit} is so important.',
  ],
  provide_proof: [
    'Let me share a quick example. {company} had the same concern, and here\'s what happened...',
    'We\'ve worked with {number} companies facing this exact situation.',
    'I can send you a case study that addresses this directly.',
  ],
  feel_felt_found: [
    'I understand how you feel. Many of our clients felt the same way. What they found was...',
    'That\'s a common concern. Others have felt that way too, but they found that...',
  ],
  isolate: [
    'Is {objection} the only thing holding you back?',
    'If we could address {objection}, would you be open to moving forward?',
    'Setting {objection} aside for a moment, how do you feel about everything else?',
  ],
  boomerang: [
    'That\'s exactly why you need this. Because {reason}.',
    'Actually, {objection} is precisely the reason our solution works so well.',
  ],
  postpone: [
    'That\'s an important point. Can we come back to that after I show you {benefit}?',
    'I\'d love to address that. Let me first share {topic}, and then we can dive into it.',
  ],
};

/**
 * Get response template by technique
 */
export function getResponseTemplate(technique: ResponseTechnique): string {
  const templates = RESPONSE_TEMPLATES[technique];
  return templates[Math.floor(Math.random() * templates.length)];
}

/**
 * Fill in template placeholders
 */
export function fillTemplate(template: string, values: Record<string, string>): string {
  let result = template;
  for (const [key, value] of Object.entries(values)) {
    result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
  }
  return result;
}

/**
 * Get best response for an objection based on context
 */
export function getBestResponse(
  responses: SuggestedResponse[],
  preferredTechnique?: ResponseTechnique
): SuggestedResponse | undefined {
  if (responses.length === 0) return undefined;

  // If preferred technique specified, try to find it
  if (preferredTechnique) {
    const preferred = responses.find(r => r.technique === preferredTechnique);
    if (preferred) return preferred;
  }

  // Otherwise return highest effectiveness
  return [...responses].sort((a, b) => b.effectiveness - a.effectiveness)[0];
}

/**
 * Score a response attempt
 */
export function scoreResponse(
  attemptedResponse: string,
  suggestedResponses: SuggestedResponse[]
): { score: number; matchedTechnique?: ResponseTechnique; feedback: string } {
  const normalized = attemptedResponse.toLowerCase();

  // Check for technique keywords
  let matchedTechnique: ResponseTechnique | undefined;
  let score = 50; // Base score

  // Acknowledge keywords
  if (normalized.includes('understand') || normalized.includes('appreciate') || normalized.includes('valid')) {
    matchedTechnique = 'acknowledge';
    score += 20;
  }

  // Clarifying question
  if (normalized.includes('?') && (normalized.includes('what') || normalized.includes('why') || normalized.includes('how'))) {
    matchedTechnique = 'clarify';
    score += 15;
  }

  // Proof/evidence
  if (normalized.includes('example') || normalized.includes('case study') || normalized.includes('clients')) {
    matchedTechnique = 'provide_proof';
    score += 20;
  }

  // Feel-felt-found
  if (normalized.includes('feel') && normalized.includes('found')) {
    matchedTechnique = 'feel_felt_found';
    score += 25;
  }

  // Avoid negative patterns
  if (normalized.includes('but') && normalized.indexOf('but') < 20) {
    score -= 10; // Starting with "but" is dismissive
  }

  const feedback = matchedTechnique
    ? `Good use of the ${TECHNIQUE_DESCRIPTIONS[matchedTechnique].toLowerCase()} technique.`
    : 'Consider using a specific objection handling technique like acknowledge, clarify, or provide proof.';

  return {
    score: Math.min(100, Math.max(0, score)),
    matchedTechnique,
    feedback,
  };
}
