// ===========================================
// Objection Library
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { ObjectionCategory } from '@underdog/core';
import type { ObjectionDefinition, ObjectionMatch, ObjectionStats } from './types';

// In-memory objection library
let objectionsCache: ObjectionDefinition[] = [];

/**
 * Load objections from JSON content files
 */
export async function loadObjections(): Promise<void> {
  // In production, this would load from content/objections/*.json
  console.log('Loading objection library...');
}

/**
 * Get all objections
 */
export function getAllObjections(): ObjectionDefinition[] {
  return [...objectionsCache];
}

/**
 * Get objections by category
 */
export function getObjectionsByCategory(category: ObjectionCategory): ObjectionDefinition[] {
  return objectionsCache.filter(o => o.category === category);
}

/**
 * Get objections by difficulty range
 */
export function getObjectionsByDifficulty(
  minDifficulty: number = 1,
  maxDifficulty: number = 5
): ObjectionDefinition[] {
  return objectionsCache.filter(
    o => o.difficulty >= minDifficulty && o.difficulty <= maxDifficulty
  );
}

/**
 * Get a specific objection by ID
 */
export function getObjectionById(id: string): ObjectionDefinition | undefined {
  return objectionsCache.find(o => o.id === id);
}

/**
 * Search objections by text (fuzzy match)
 */
export function searchObjections(query: string): ObjectionDefinition[] {
  const lowerQuery = query.toLowerCase();
  return objectionsCache.filter(o => {
    if (o.text.toLowerCase().includes(lowerQuery)) return true;
    if (o.variations.some(v => v.toLowerCase().includes(lowerQuery))) return true;
    if (o.tags.some(t => t.toLowerCase().includes(lowerQuery))) return true;
    return false;
  });
}

/**
 * Match user input to objections
 */
export function matchObjection(input: string): ObjectionMatch | null {
  const normalizedInput = input.toLowerCase().trim();
  let bestMatch: ObjectionMatch | null = null;

  for (const objection of objectionsCache) {
    // Check main text
    const mainSimilarity = calculateSimilarity(normalizedInput, objection.text.toLowerCase());
    if (mainSimilarity > (bestMatch?.confidence ?? 0.5)) {
      bestMatch = { objection, confidence: mainSimilarity };
    }

    // Check variations
    for (const variation of objection.variations) {
      const varSimilarity = calculateSimilarity(normalizedInput, variation.toLowerCase());
      if (varSimilarity > (bestMatch?.confidence ?? 0.5)) {
        bestMatch = { objection, confidence: varSimilarity, matchedVariation: variation };
      }
    }
  }

  return bestMatch;
}

/**
 * Simple string similarity (Jaccard index on words)
 */
function calculateSimilarity(a: string, b: string): number {
  const wordsA = new Set(a.split(/\s+/).filter(w => w.length > 2));
  const wordsB = new Set(b.split(/\s+/).filter(w => w.length > 2));

  if (wordsA.size === 0 || wordsB.size === 0) return 0;

  const intersection = new Set([...wordsA].filter(w => wordsB.has(w)));
  const union = new Set([...wordsA, ...wordsB]);

  return intersection.size / union.size;
}

/**
 * Get random objections for training
 */
export function getRandomObjections(count: number, category?: ObjectionCategory): ObjectionDefinition[] {
  const pool = category ? getObjectionsByCategory(category) : objectionsCache;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get objection library statistics
 */
export function getObjectionStats(): ObjectionStats {
  const byCategory: Record<string, number> = { common: 0, industry: 0, personality: 0 };
  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalDifficulty = 0;

  for (const objection of objectionsCache) {
    byCategory[objection.category] = (byCategory[objection.category] ?? 0) + 1;
    byDifficulty[objection.difficulty] = (byDifficulty[objection.difficulty] ?? 0) + 1;
    totalDifficulty += objection.difficulty;
  }

  return {
    totalObjections: objectionsCache.length,
    byCategory: byCategory as Record<ObjectionCategory, number>,
    byDifficulty,
    averageDifficulty: objectionsCache.length > 0 ? totalDifficulty / objectionsCache.length : 0,
  };
}

/**
 * Register an objection in the cache
 */
export function registerObjection(objection: ObjectionDefinition): void {
  objectionsCache.push(objection);
}

/**
 * Clear the objection cache
 */
export function clearObjectionCache(): void {
  objectionsCache = [];
}
