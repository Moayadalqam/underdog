// ===========================================
// Transcript Analyzer
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { FeedbackItem, FeedbackCategory, FeedbackSeverity, TranscriptForFeedback } from './types';
import { generateId } from '@underdog/core';

/**
 * Analyze transcript for feedback items
 */
export function analyzeTranscript(transcript: TranscriptForFeedback): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  // Analyze trainee segments
  const traineeSegments = transcript.segments.filter(s => s.speaker === 'trainee');

  for (const segment of traineeSegments) {
    const text = segment.text.toLowerCase();

    // Check for filler words
    const fillerFeedback = checkFillerWords(text, segment.timestamp);
    if (fillerFeedback) items.push(fillerFeedback);

    // Check for weak language
    const weakLanguageFeedback = checkWeakLanguage(text, segment.timestamp);
    if (weakLanguageFeedback) items.push(weakLanguageFeedback);

    // Check for good practices
    const positiveFeedback = checkPositivePractices(text, segment.timestamp);
    items.push(...positiveFeedback);
  }

  // Analyze conversation flow
  const flowFeedback = analyzeConversationFlow(transcript);
  items.push(...flowFeedback);

  return items;
}

function checkFillerWords(text: string, timestamp: number): FeedbackItem | null {
  const fillers = text.match(/\b(um|uh|like|you know|basically|actually|literally)\b/g);

  if (fillers && fillers.length >= 3) {
    return {
      id: generateId(),
      category: 'communication',
      severity: 'important',
      message: `Used ${fillers.length} filler words in this segment`,
      suggestion: 'Practice pausing instead of using filler words. Silence is more powerful than "um".',
      timestamp,
      evidence: `Found: ${[...new Set(fillers)].join(', ')}`,
    };
  }

  return null;
}

function checkWeakLanguage(text: string, timestamp: number): FeedbackItem | null {
  const weakPhrases = [
    { pattern: /i think/g, suggestion: 'Be more definitive - say "I know" or "Based on my experience"' },
    { pattern: /kind of|sort of/g, suggestion: 'Remove hedging language for more confidence' },
    { pattern: /does that make sense/g, suggestion: 'Instead, ask "What questions do you have?"' },
    { pattern: /to be honest/g, suggestion: 'This implies you might not always be honest - remove it' },
  ];

  for (const { pattern, suggestion } of weakPhrases) {
    if (pattern.test(text)) {
      return {
        id: generateId(),
        category: 'communication',
        severity: 'suggestion',
        message: 'Used weak or hedging language',
        suggestion,
        timestamp,
      };
    }
  }

  return null;
}

function checkPositivePractices(text: string, timestamp: number): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  // Check for good question asking
  if (/\b(tell me more|help me understand|what|how|why)\b.*\?/.test(text)) {
    items.push({
      id: generateId(),
      category: 'discovery',
      severity: 'positive',
      message: 'Great open-ended question!',
      timestamp,
    });
  }

  // Check for active listening
  if (/\b(you mentioned|you said|i hear|so what you.re saying)\b/.test(text)) {
    items.push({
      id: generateId(),
      category: 'rapport',
      severity: 'positive',
      message: 'Excellent active listening - referencing what the prospect said',
      timestamp,
    });
  }

  // Check for value-first language
  if (/\b(help you|save you|increase your|reduce your)\b/.test(text)) {
    items.push({
      id: generateId(),
      category: 'opening',
      severity: 'positive',
      message: 'Good focus on value for the prospect',
      timestamp,
    });
  }

  return items;
}

function analyzeConversationFlow(transcript: TranscriptForFeedback): FeedbackItem[] {
  const items: FeedbackItem[] = [];

  // Calculate talk ratio
  const traineeWords = transcript.segments
    .filter(s => s.speaker === 'trainee')
    .reduce((sum, s) => sum + s.text.split(/\s+/).length, 0);

  const prospectWords = transcript.segments
    .filter(s => s.speaker === 'prospect')
    .reduce((sum, s) => sum + s.text.split(/\s+/).length, 0);

  const talkRatio = traineeWords / (traineeWords + prospectWords || 1);

  if (talkRatio > 0.6) {
    items.push({
      id: generateId(),
      category: 'discovery',
      severity: 'important',
      message: `Talk ratio imbalance - you spoke ${Math.round(talkRatio * 100)}% of the time`,
      suggestion: 'Aim to let the prospect speak 60%+ of the time. Ask more questions and listen.',
    });
  } else if (talkRatio < 0.4) {
    items.push({
      id: generateId(),
      category: 'discovery',
      severity: 'positive',
      message: 'Excellent talk ratio - prospect spoke most of the time',
    });
  }

  // Check for interruptions (trainee segment immediately after trainee segment)
  let consecutiveTrainee = 0;
  for (const segment of transcript.segments) {
    if (segment.speaker === 'trainee') {
      consecutiveTrainee++;
      if (consecutiveTrainee > 2) {
        items.push({
          id: generateId(),
          category: 'communication',
          severity: 'suggestion',
          message: 'Long monologue detected - consider breaking up with questions',
          timestamp: segment.timestamp,
        });
        break;
      }
    } else {
      consecutiveTrainee = 0;
    }
  }

  return items;
}

/**
 * Count feedback by severity
 */
export function countBySeverity(items: FeedbackItem[]): Record<FeedbackSeverity, number> {
  return items.reduce(
    (acc, item) => {
      acc[item.severity]++;
      return acc;
    },
    { critical: 0, important: 0, suggestion: 0, positive: 0 }
  );
}

/**
 * Count feedback by category
 */
export function countByCategory(items: FeedbackItem[]): Record<FeedbackCategory, number> {
  return items.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    },
    {} as Record<FeedbackCategory, number>
  );
}
