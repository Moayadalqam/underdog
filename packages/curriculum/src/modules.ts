// ===========================================
// Module Data Access
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import type { ModuleSummary, ModuleWithContent, CurriculumNavItem } from './types';

// In-memory module data (will be loaded from content/ JSON files)
let modulesCache: Map<string, ModuleWithContent> = new Map();

/**
 * Load modules from JSON content files
 */
export async function loadModules(): Promise<void> {
  // In production, this would load from content/curriculum/*.json
  // For now, we'll use the database via @underdog/database
  console.log('Loading curriculum modules...');
}

/**
 * Get all modules as summaries (for list views)
 */
export function getAllModuleSummaries(): ModuleSummary[] {
  const summaries: ModuleSummary[] = [];

  for (const module of modulesCache.values()) {
    summaries.push({
      id: module.id,
      number: module.number,
      title: module.title,
      description: module.description,
      lessonCount: module.lessons.length,
      scenarioCount: module.scenarios?.length ?? 0,
      estimatedMinutes: module.lessons.length * 15, // ~15 min per lesson
    });
  }

  return summaries.sort((a, b) => a.number - b.number);
}

/**
 * Get a specific module by ID
 */
export function getModuleById(id: string): ModuleWithContent | undefined {
  return modulesCache.get(id);
}

/**
 * Get a specific module by number (1-12)
 */
export function getModuleByNumber(number: number): ModuleWithContent | undefined {
  for (const module of modulesCache.values()) {
    if (module.number === number) {
      return module;
    }
  }
  return undefined;
}

/**
 * Get navigation items for curriculum sidebar
 */
export function getNavigationItems(
  currentModuleId?: string,
  completedModuleIds: string[] = []
): CurriculumNavItem[] {
  const modules = getAllModuleSummaries();
  const completedSet = new Set(completedModuleIds);

  return modules.map((module, index) => {
    const isCompleted = completedSet.has(module.id);
    const isCurrent = module.id === currentModuleId;

    // Modules are unlocked sequentially (first module always unlocked)
    const previousCompleted = index === 0 || completedSet.has(modules[index - 1].id);
    const isLocked = !isCompleted && !isCurrent && !previousCompleted;

    return {
      moduleNumber: module.number,
      moduleId: module.id,
      title: module.title,
      isCompleted,
      isCurrent,
      isLocked,
    };
  });
}

/**
 * Get next module in sequence
 */
export function getNextModule(currentModuleNumber: number): ModuleWithContent | undefined {
  return getModuleByNumber(currentModuleNumber + 1);
}

/**
 * Get previous module in sequence
 */
export function getPreviousModule(currentModuleNumber: number): ModuleWithContent | undefined {
  if (currentModuleNumber <= 1) return undefined;
  return getModuleByNumber(currentModuleNumber - 1);
}

/**
 * Register a module in the cache (for loading from JSON)
 */
export function registerModule(module: ModuleWithContent): void {
  modulesCache.set(module.id, module);
}

/**
 * Clear the module cache
 */
export function clearModuleCache(): void {
  modulesCache.clear();
}
