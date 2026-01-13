// ===========================================
// Improvement Suggestions
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { SessionFeedback, FeedbackItem, FeedbackContext } from './types';
import { analyzeTranscript, countBySeverity } from './analyzer';
import { generateId } from '@underdog/core';

/**
 * Generate complete session feedback
 */
export function generateSessionFeedback(context: FeedbackContext): SessionFeedback {
  const items = analyzeTranscript(context.transcript);
  const counts = countBySeverity(items);

  const summary = generateSummary(items, context);
  const topStrength = findTopStrength(items);
  const topImprovement = findTopImprovement(items);
  const actionItems = generateActionItems(items, context.userLevel);

  return {
    sessionId: context.sessionId,
    items,
    summary,
    topStrength,
    topImprovement,
    actionItems,
    generatedAt: new Date(),
  };
}

function generateSummary(items: FeedbackItem[], context: FeedbackContext): string {
  const counts = countBySeverity(items);
  const positiveCount = counts.positive;
  const improvementCount = counts.critical + counts.important;

  if (improvementCount === 0 && positiveCount >= 3) {
    return 'Excellent performance! You demonstrated strong sales skills throughout this call.';
  }

  if (improvementCount >= 3) {
    return 'This call has several areas for improvement. Focus on the action items below to strengthen your approach.';
  }

  return 'Solid call with some areas to refine. Review the feedback to continue improving.';
}

function findTopStrength(items: FeedbackItem[]): string {
  const positives = items.filter(i => i.severity === 'positive');

  if (positives.length === 0) {
    return 'Keep practicing to develop your strengths!';
  }

  // Group by category and find most common
  const categoryCount: Record<string, number> = {};
  for (const item of positives) {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  }

  const topCategory = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];

  const categoryStrengths: Record<string, string> = {
    opening: 'Creating compelling openings that capture attention',
    rapport: 'Building rapport through active listening',
    discovery: 'Asking great discovery questions',
    objection_handling: 'Handling objections professionally',
    closing: 'Strong closing techniques',
    communication: 'Clear and confident communication',
  };

  return categoryStrengths[topCategory?.[0]] ?? positives[0].message;
}

function findTopImprovement(items: FeedbackItem[]): string {
  // Prioritize critical, then important
  const critical = items.find(i => i.severity === 'critical');
  if (critical) return critical.message;

  const important = items.find(i => i.severity === 'important');
  if (important) return important.message;

  const suggestion = items.find(i => i.severity === 'suggestion');
  if (suggestion) return suggestion.message;

  return 'Continue refining your technique with more practice.';
}

function generateActionItems(items: FeedbackItem[], level: 'beginner' | 'intermediate' | 'advanced'): string[] {
  const actionItems: string[] = [];

  // Add specific action items based on feedback
  const improvements = items.filter(i => i.severity === 'critical' || i.severity === 'important');

  for (const item of improvements.slice(0, 3)) {
    if (item.suggestion) {
      actionItems.push(item.suggestion);
    }
  }

  // Add level-appropriate general tips
  if (level === 'beginner') {
    if (actionItems.length < 3) {
      actionItems.push('Practice your opening script 10 times before your next call');
    }
  } else if (level === 'intermediate') {
    if (actionItems.length < 3) {
      actionItems.push('Record and review your next 3 calls');
    }
  } else {
    if (actionItems.length < 3) {
      actionItems.push('Focus on asking one more layer of questions to uncover deeper needs');
    }
  }

  return actionItems.slice(0, 5);
}

/**
 * Get contextual tips based on current call phase
 */
export function getContextualTip(
  phase: 'opening' | 'discovery' | 'objection' | 'closing',
  performanceHint?: 'struggling' | 'neutral' | 'doing_well'
): string {
  const tips: Record<string, Record<string, string[]>> = {
    opening: {
      struggling: [
        'Try leading with a specific result you\'ve achieved for similar companies',
        'Ask "Is now a bad time?" to disarm the prospect',
      ],
      neutral: [
        'Make sure to personalize your opening with research',
      ],
      doing_well: [
        'Great energy! Now transition smoothly to discovery',
      ],
    },
    discovery: {
      struggling: [
        'Ask "Tell me more about that" to get the prospect talking',
        'Try "What would it mean for your team if this problem was solved?"',
      ],
      neutral: [
        'Look for pain points you can address',
      ],
      doing_well: [
        'Excellent questioning! Make sure to paraphrase their answers',
      ],
    },
    objection: {
      struggling: [
        'Acknowledge the objection first: "I completely understand..."',
        'Ask "Is that the only thing holding you back?"',
      ],
      neutral: [
        'Remember: objections are buying signals',
      ],
      doing_well: [
        'Nice handling! Now bridge back to value',
      ],
    },
    closing: {
      struggling: [
        'Summarize the value before asking for the close',
        'Try "Based on what you\'ve shared, it sounds like X would help. Would you like to explore that?"',
      ],
      neutral: [
        'Ask for a specific next step',
      ],
      doing_well: [
        'Confident close! Make sure to confirm next steps clearly',
      ],
    },
  };

  const phaseTips = tips[phase];
  const performance = performanceHint ?? 'neutral';
  const tipList = phaseTips[performance] ?? phaseTips.neutral;

  return tipList[Math.floor(Math.random() * tipList.length)];
}
