// ===========================================
// Training Scenarios
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { ScenarioSummary } from './types';

/**
 * Scenario difficulty levels
 */
export const DIFFICULTY_LABELS: Record<number, string> = {
  1: 'Beginner',
  2: 'Easy',
  3: 'Intermediate',
  4: 'Advanced',
  5: 'Expert',
};

/**
 * Get scenarios for a module
 */
export function getModuleScenarios(moduleId: string, scenarios: ScenarioSummary[]): ScenarioSummary[] {
  return scenarios.filter(s => s.moduleId === moduleId);
}

/**
 * Get scenarios by difficulty
 */
export function getScenariosByDifficulty(
  scenarios: ScenarioSummary[],
  minDifficulty: number = 1,
  maxDifficulty: number = 5
): ScenarioSummary[] {
  return scenarios.filter(
    s => s.difficulty >= minDifficulty && s.difficulty <= maxDifficulty
  );
}

/**
 * Get a random scenario from a set
 */
export function getRandomScenario(scenarios: ScenarioSummary[]): ScenarioSummary | undefined {
  if (scenarios.length === 0) return undefined;
  const index = Math.floor(Math.random() * scenarios.length);
  return scenarios[index];
}

/**
 * Get recommended scenarios based on user's skill level
 */
export function getRecommendedScenarios(
  allScenarios: ScenarioSummary[],
  userAverageScore: number, // 0-100
  completedScenarioIds: string[] = [],
  limit: number = 3
): ScenarioSummary[] {
  // Map score to difficulty (higher score = higher difficulty)
  const targetDifficulty = Math.min(5, Math.max(1, Math.ceil(userAverageScore / 20)));

  const completedSet = new Set(completedScenarioIds);

  // Prioritize uncompleted scenarios at or near target difficulty
  const scored = allScenarios
    .filter(s => !completedSet.has(s.id))
    .map(s => ({
      scenario: s,
      score: Math.abs(s.difficulty - targetDifficulty),
    }))
    .sort((a, b) => a.score - b.score);

  return scored.slice(0, limit).map(s => s.scenario);
}

/**
 * Build scenario context for AI prompt
 */
export function buildScenarioContext(scenario: ScenarioSummary): string {
  return `
## Training Scenario: ${scenario.title}

${scenario.description}

Difficulty: ${DIFFICULTY_LABELS[scenario.difficulty] ?? 'Unknown'}
${scenario.personaHint ? `Suggested Approach: ${scenario.personaHint}` : ''}
`.trim();
}

/**
 * Validate scenario difficulty
 */
export function isValidDifficulty(difficulty: number): boolean {
  return Number.isInteger(difficulty) && difficulty >= 1 && difficulty <= 5;
}
