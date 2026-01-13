// ===========================================
// Discovery Rubric (25% weight)
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { ScoringRubric, ScoringSegment, CategoryScore } from '../types';

export const DISCOVERY_RUBRIC: ScoringRubric = {
  category: 'discovery',
  weight: 0.25,
  criteria: [
    {
      name: 'Question Quality',
      description: 'Quality and depth of discovery questions',
      maxPoints: 35,
      levels: [
        { points: 35, label: 'Excellent', description: 'Open-ended, thought-provoking questions', indicators: ['what', 'how', 'tell me about', 'help me understand'] },
        { points: 25, label: 'Good', description: 'Mix of open and closed questions', indicators: ['why', 'when'] },
        { points: 15, label: 'Fair', description: 'Mostly closed questions', indicators: ['yes/no questions'] },
        { points: 0, label: 'Poor', description: 'Few or no questions asked', indicators: ['no questions', 'statement only'] },
      ],
    },
    {
      name: 'Active Listening',
      description: 'Evidence of listening and building on responses',
      maxPoints: 30,
      levels: [
        { points: 30, label: 'Excellent', description: 'References prospect words, paraphrases', indicators: ['so what you are saying', 'i hear that', 'you mentioned'] },
        { points: 20, label: 'Good', description: 'Acknowledges responses before continuing', indicators: ['that makes sense', 'i understand'] },
        { points: 10, label: 'Fair', description: 'Moves to next question without acknowledgment', indicators: ['rapid questions'] },
        { points: 0, label: 'Poor', description: 'Ignores or talks over responses', indicators: ['interrupting', 'ignoring'] },
      ],
    },
    {
      name: 'Pain Discovery',
      description: 'Uncovers specific pain points and challenges',
      maxPoints: 20,
      levels: [
        { points: 20, label: 'Excellent', description: 'Identifies multiple specific pain points', indicators: ['challenge', 'frustration', 'pain', 'problem'] },
        { points: 12, label: 'Good', description: 'Identifies at least one pain point', indicators: ['issue', 'concern'] },
        { points: 5, label: 'Fair', description: 'Surface-level understanding only', indicators: ['general needs'] },
        { points: 0, label: 'Poor', description: 'No pain discovery attempted', indicators: ['no pain questions'] },
      ],
    },
    {
      name: 'Talk Ratio',
      description: 'Appropriate balance of talking vs listening',
      maxPoints: 15,
      levels: [
        { points: 15, label: 'Excellent', description: 'Prospect talks 60%+ of the time', indicators: ['good ratio'] },
        { points: 10, label: 'Good', description: 'Roughly equal talk time', indicators: ['balanced'] },
        { points: 5, label: 'Fair', description: 'Trainee talks 60%+ of time', indicators: ['trainee dominant'] },
        { points: 0, label: 'Poor', description: 'Trainee dominates conversation', indicators: ['monologue'] },
      ],
    },
  ],
};

/**
 * Score the discovery phase of a call
 */
export function scoreDiscovery(segments: ScoringSegment[]): CategoryScore {
  // Skip opening (first 60 sec), focus on middle of call
  const discoverySegments = segments.filter(
    s => s.timestamp > 60 && s.timestamp < segments[segments.length - 1].timestamp - 60
  );

  const traineeText = discoverySegments
    .filter(s => s.speaker === 'trainee')
    .map(s => s.text.toLowerCase())
    .join(' ');

  const prospectText = discoverySegments
    .filter(s => s.speaker === 'prospect')
    .map(s => s.text.toLowerCase())
    .join(' ');

  const traineeWords = traineeText.split(/\s+/).length;
  const prospectWords = prospectText.split(/\s+/).length;
  const talkRatio = prospectWords / (traineeWords + prospectWords || 1);

  const criteria = DISCOVERY_RUBRIC.criteria.map(criterion => {
    const score = scoreCriterion(criterion.name, traineeText, prospectText, talkRatio);
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
    category: 'discovery',
    score: normalizedScore,
    weight: DISCOVERY_RUBRIC.weight,
    criteria,
    feedback: generateDiscoveryFeedback(normalizedScore, talkRatio, criteria),
  };
}

function scoreCriterion(name: string, traineeText: string, prospectText: string, talkRatio: number): number {
  switch (name) {
    case 'Question Quality':
      const openQuestions = (traineeText.match(/\b(what|how|tell me|help me understand|why)\b.*\?/g) || []).length;
      const closedQuestions = (traineeText.match(/\?/g) || []).length - openQuestions;
      if (openQuestions >= 3) return 35;
      if (openQuestions >= 2) return 25;
      if (openQuestions >= 1 || closedQuestions >= 2) return 15;
      return 5;

    case 'Active Listening':
      const listening = (traineeText.match(/\b(you mentioned|you said|i hear|so what you|that makes sense|i understand)\b/g) || []).length;
      if (listening >= 3) return 30;
      if (listening >= 2) return 20;
      if (listening >= 1) return 10;
      return 5;

    case 'Pain Discovery':
      const painDiscovery = (traineeText.match(/\b(challenge|frustration|pain|problem|struggle|issue|concern|difficult)\b/g) || []).length;
      const prospectPain = (prospectText.match(/\b(challenge|frustration|pain|problem|struggle|issue|concern|difficult)\b/g) || []).length;
      if (painDiscovery >= 2 && prospectPain >= 2) return 20;
      if (painDiscovery >= 1 || prospectPain >= 1) return 12;
      return 5;

    case 'Talk Ratio':
      if (talkRatio >= 0.6) return 15;
      if (talkRatio >= 0.45) return 10;
      if (talkRatio >= 0.3) return 5;
      return 0;

    default:
      return 10;
  }
}

function getEvidence(name: string, text: string): string[] {
  const evidence: string[] = [];

  if (name === 'Question Quality') {
    const questions = text.match(/[^.!?]*\?/g) || [];
    evidence.push(...questions.slice(0, 3).map(q => `Asked: "${q.trim()}"`));
  }

  return evidence;
}

function generateDiscoveryFeedback(score: number, talkRatio: number, criteria: { name: string; score: number; maxScore: number }[]): string[] {
  const feedback: string[] = [];

  if (score >= 80) {
    feedback.push('Excellent discovery - you uncovered valuable information.');
  } else if (score >= 60) {
    feedback.push('Good discovery phase with some areas to improve.');
  } else {
    feedback.push('Discovery needs improvement - ask more open-ended questions.');
  }

  if (talkRatio < 0.4) {
    feedback.push('Try to let the prospect talk more. Aim for 60% prospect talk time.');
  }

  return feedback;
}
