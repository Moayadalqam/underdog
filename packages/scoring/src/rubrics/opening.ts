// ===========================================
// Opening Rubric (25% weight)
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { ScoringRubric, ScoringSegment, CategoryScore } from '../types';

export const OPENING_RUBRIC: ScoringRubric = {
  category: 'opening',
  weight: 0.25,
  criteria: [
    {
      name: 'Hook Strength',
      description: 'How effectively the opening captures attention',
      maxPoints: 30,
      levels: [
        { points: 30, label: 'Excellent', description: 'Compelling hook that creates immediate interest', indicators: ['value-first', 'personalized', 'relevant trigger'] },
        { points: 20, label: 'Good', description: 'Clear value proposition mentioned early', indicators: ['states benefit', 'mentions outcome'] },
        { points: 10, label: 'Fair', description: 'Standard introduction with some value', indicators: ['company name', 'reason for call'] },
        { points: 0, label: 'Poor', description: 'Weak or generic opening', indicators: ['how are you', 'do you have a minute'] },
      ],
    },
    {
      name: 'Permission/Respect',
      description: 'Shows respect for prospect time',
      maxPoints: 25,
      levels: [
        { points: 25, label: 'Excellent', description: 'Asks permission in engaging way', indicators: ['is now a bad time', 'caught you at a bad moment'] },
        { points: 15, label: 'Good', description: 'Acknowledges they may be busy', indicators: ['i know you are busy', 'quick question'] },
        { points: 5, label: 'Fair', description: 'Moves directly to pitch', indicators: ['direct approach'] },
        { points: 0, label: 'Poor', description: 'Ignores prospect comfort', indicators: ['aggressive start', 'no acknowledgment'] },
      ],
    },
    {
      name: 'Energy/Confidence',
      description: 'Vocal energy and confidence level',
      maxPoints: 25,
      levels: [
        { points: 25, label: 'Excellent', description: 'Confident, energetic, professional', indicators: ['clear voice', 'good pace', 'enthusiastic'] },
        { points: 15, label: 'Good', description: 'Steady and professional', indicators: ['calm', 'steady'] },
        { points: 5, label: 'Fair', description: 'Somewhat uncertain', indicators: ['hesitation', 'um', 'uh'] },
        { points: 0, label: 'Poor', description: 'Low energy or over-aggressive', indicators: ['mumbling', 'rushing', 'too loud'] },
      ],
    },
    {
      name: 'Transition',
      description: 'Smooth transition to discovery or pitch',
      maxPoints: 20,
      levels: [
        { points: 20, label: 'Excellent', description: 'Natural bridge to next phase', indicators: ['curiosity question', 'smooth flow'] },
        { points: 12, label: 'Good', description: 'Clear transition', indicators: ['transition phrase'] },
        { points: 5, label: 'Fair', description: 'Abrupt but functional', indicators: ['abrupt shift'] },
        { points: 0, label: 'Poor', description: 'No clear transition', indicators: ['rambling', 'lost direction'] },
      ],
    },
  ],
};

/**
 * Score the opening phase of a call
 */
export function scoreOpening(segments: ScoringSegment[]): CategoryScore {
  // Get opening segments (first 60 seconds or first 5 trainee turns)
  const openingSegments = getOpeningSegments(segments);
  const traineeText = openingSegments
    .filter(s => s.speaker === 'trainee')
    .map(s => s.text.toLowerCase())
    .join(' ');

  const criteria = OPENING_RUBRIC.criteria.map(criterion => {
    const score = scoreCriterion(criterion.name, traineeText);
    return {
      name: criterion.name,
      score,
      maxScore: criterion.maxPoints,
      evidence: getEvidence(criterion.name, traineeText),
    };
  });

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxPossible = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const normalizedScore = Math.round((totalScore / maxPossible) * 100);

  return {
    category: 'opening',
    score: normalizedScore,
    weight: OPENING_RUBRIC.weight,
    criteria,
    feedback: generateOpeningFeedback(normalizedScore, criteria),
  };
}

function getOpeningSegments(segments: ScoringSegment[]): ScoringSegment[] {
  let traineeCount = 0;
  const result: ScoringSegment[] = [];

  for (const segment of segments) {
    if (segment.timestamp > 60) break;
    if (segment.speaker === 'trainee') {
      traineeCount++;
      if (traineeCount > 5) break;
    }
    result.push(segment);
  }

  return result;
}

function scoreCriterion(name: string, text: string): number {
  switch (name) {
    case 'Hook Strength':
      if (text.includes('help') && text.includes('companies like')) return 30;
      if (text.includes('reason') && text.includes('call')) return 20;
      if (text.includes('calling') || text.includes('reaching out')) return 10;
      return 5;

    case 'Permission/Respect':
      if (text.includes('bad time') || text.includes('catch you')) return 25;
      if (text.includes('busy') || text.includes('moment')) return 15;
      if (text.includes('quick')) return 10;
      return 5;

    case 'Energy/Confidence':
      // Would need audio analysis in production
      const fillerCount = (text.match(/\b(um|uh|like|you know)\b/g) || []).length;
      if (fillerCount === 0) return 25;
      if (fillerCount <= 2) return 15;
      if (fillerCount <= 5) return 5;
      return 0;

    case 'Transition':
      if (text.includes('?') && text.includes('curious')) return 20;
      if (text.includes('?')) return 12;
      return 5;

    default:
      return 10;
  }
}

function getEvidence(name: string, text: string): string[] {
  const evidence: string[] = [];

  if (name === 'Hook Strength') {
    if (text.includes('help')) evidence.push('Used "help" language');
    if (text.includes('save') || text.includes('reduce')) evidence.push('Mentioned outcome');
  }

  if (name === 'Permission/Respect') {
    if (text.includes('bad time')) evidence.push('Asked about timing');
  }

  return evidence;
}

function generateOpeningFeedback(score: number, criteria: { name: string; score: number; maxScore: number }[]): string[] {
  const feedback: string[] = [];

  if (score >= 80) {
    feedback.push('Strong opening that captures attention effectively.');
  } else if (score >= 60) {
    feedback.push('Solid opening with room for improvement.');
  } else {
    feedback.push('Opening needs work - focus on leading with value.');
  }

  const weakest = criteria.reduce((min, c) =>
    (c.score / c.maxScore) < (min.score / min.maxScore) ? c : min
  );

  if (weakest.score / weakest.maxScore < 0.5) {
    feedback.push(`Focus on improving: ${weakest.name}`);
  }

  return feedback;
}
