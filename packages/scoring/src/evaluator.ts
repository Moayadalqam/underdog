// ===========================================
// Main Scoring Evaluator
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import type { SessionScore, ScoringTranscript, CategoryScore } from './types';
import { scoreOpening } from './rubrics/opening';
import { scoreDiscovery } from './rubrics/discovery';

/**
 * Evaluate a complete training session
 */
export function evaluateSession(transcript: ScoringTranscript): SessionScore {
  const categories: CategoryScore[] = [];

  // Score each category
  const opening = scoreOpening(transcript.segments);
  categories.push(opening);

  const discovery = scoreDiscovery(transcript.segments);
  categories.push(discovery);

  // Objection handling and closing would be scored similarly
  // For now, provide placeholder scores
  categories.push(createPlaceholderScore('objectionHandling', 0.30));
  categories.push(createPlaceholderScore('closing', 0.20));

  // Calculate weighted overall score
  const overallScore = Math.round(
    categories.reduce((sum, cat) => sum + cat.score * cat.weight, 0)
  );

  // Extract strengths and improvements
  const strengths = extractStrengths(categories);
  const improvements = extractImprovements(categories);

  return {
    sessionId: transcript.sessionId,
    overallScore,
    categories,
    strengths,
    improvements,
    generatedAt: new Date(),
  };
}

function createPlaceholderScore(category: 'objectionHandling' | 'closing', weight: number): CategoryScore {
  return {
    category,
    score: 50, // Placeholder
    weight,
    criteria: [],
    feedback: [`${category} scoring coming soon`],
  };
}

function extractStrengths(categories: CategoryScore[]): string[] {
  const strengths: string[] = [];

  for (const cat of categories) {
    if (cat.score >= 70) {
      strengths.push(`Strong ${formatCategoryName(cat.category)} skills`);
    }

    // Add specific criteria strengths
    for (const criterion of cat.criteria) {
      if (criterion.score / criterion.maxScore >= 0.8) {
        strengths.push(`Excellent ${criterion.name.toLowerCase()}`);
      }
    }
  }

  return strengths.slice(0, 3); // Top 3 strengths
}

function extractImprovements(categories: CategoryScore[]): string[] {
  const improvements: string[] = [];

  for (const cat of categories) {
    if (cat.score < 60) {
      improvements.push(`Work on ${formatCategoryName(cat.category)}`);
    }

    // Add specific criteria improvements
    for (const criterion of cat.criteria) {
      if (criterion.score / criterion.maxScore < 0.5) {
        improvements.push(`Improve ${criterion.name.toLowerCase()}`);
      }
    }
  }

  return improvements.slice(0, 3); // Top 3 improvements
}

function formatCategoryName(category: string): string {
  return category
    .replace(/([A-Z])/g, ' $1')
    .toLowerCase()
    .trim();
}

/**
 * Get a letter grade from a numeric score
 */
export function getLetterGrade(score: number): string {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Get performance level description
 */
export function getPerformanceLevel(score: number): string {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Proficient';
  if (score >= 70) return 'Developing';
  if (score >= 60) return 'Needs Improvement';
  return 'Requires Training';
}

/**
 * Compare score to average
 */
export function compareToAverage(score: number, average: number): string {
  const diff = score - average;
  if (diff >= 10) return 'Well above average';
  if (diff >= 5) return 'Above average';
  if (diff >= -5) return 'Average';
  if (diff >= -10) return 'Below average';
  return 'Well below average';
}
