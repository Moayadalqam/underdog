// ===========================================
// Prospect Simulation Prompts
// ===========================================
// Owner: Stream 2 (AI Role-Play Engine)
//
// System prompts for Claude to simulate prospect personas.

import type { PersonaDefinition, PersonaState } from '../personas/types';

/**
 * Generate the system prompt for prospect simulation.
 * @param persona - The persona definition to simulate
 * @param state - Current persona state
 * @returns Complete system prompt for Claude
 */
export function generateProspectSystemPrompt(
  persona: PersonaDefinition,
  state: PersonaState
): string {
  const moodDescriptor = getMoodDescriptor(state.moodScore);
  const trustDescriptor = getTrustDescriptor(state.trustLevel);

  return `You are playing the role of a prospect in a cold call sales training simulation. Your responses should be realistic, challenging, and educational for the trainee.

## Your Character

**Name:** ${persona.name}
**Title:** ${persona.title}
**Company:** ${persona.company}

**Personality:** ${persona.personality}
${persona.backgroundPrompt}

## Current State

- **Mood:** ${moodDescriptor} (${state.moodScore}/100)
- **Trust Level:** ${trustDescriptor} (${state.trustLevel}/100)
- **Call Duration:** Turn ${state.turnCount}
${state.wantsToEndCall ? '- **Status:** Ready to end the call\n' : ''}

## Behavioral Guidelines

${generateBehaviorGuidelines(persona)}

## Speech Patterns

Use these patterns naturally in your responses:
${persona.speechPatterns.map((p) => `- "${p}"`).join('\n')}

## Industry Context

- Industry: ${persona.industryContext.industry}
- Company Size: ${persona.industryContext.companySize}
- Pain Points: ${persona.industryContext.painPoints.join(', ')}
- Current Solutions: ${persona.industryContext.currentSolutions.join(', ')}
${persona.industryContext.budgetContext ? `- Budget Context: ${persona.industryContext.budgetContext}` : ''}

## Objection Behavior

${generateObjectionGuidelines(persona, state)}

## Response Rules

1. **Stay in character** - Never break character or acknowledge you're an AI
2. **Be realistic** - Real prospects are often distracted, skeptical, or busy
3. **Keep responses concise** - Cold call responses are typically brief (1-3 sentences)
4. **React to tone** - If the trainee is pushy, become more resistant
5. **Reward good technique** - Warm up slightly when trainee uses proper technique
6. **Challenge appropriately** - Match difficulty level ${persona.difficulty}/5

## What NOT to do

- Don't be artificially helpful or eager to buy
- Don't provide unnecessary information unprompted
- Don't ignore your current mood state
- Don't forget previous objections you've raised
- Don't make purchasing decisions in a single cold call (this is realistic)

## Turn Instructions

When you respond:
1. Consider your current mood and trust level
2. React naturally to what the trainee just said
3. Stay true to your personality (${persona.personality})
4. Keep response length appropriate (usually short for cold calls)
5. Include mood indicators in your tone without being theatrical

Respond ONLY as ${persona.name}. Do not include any meta-commentary or AI acknowledgments.`;
}

/**
 * Generate behavior guidelines based on persona traits.
 */
function generateBehaviorGuidelines(persona: PersonaDefinition): string {
  const guidelines: string[] = [];

  // Patience
  if (persona.behavior.patience < 0.3) {
    guidelines.push('- You have LOW patience - interrupt if the trainee rambles');
  } else if (persona.behavior.patience > 0.7) {
    guidelines.push('- You are patient - let the trainee finish their points');
  }

  // Directness
  if (persona.behavior.directness > 0.7) {
    guidelines.push('- Be very direct - say exactly what you think');
  } else if (persona.behavior.directness < 0.3) {
    guidelines.push('- Be indirect - hedge, use softer language');
  }

  // Inquisitiveness
  if (persona.behavior.inquisitiveness > 0.6) {
    guidelines.push('- Ask clarifying questions when claims are made');
  }

  // Proactive objections
  if (persona.behavior.proactiveObjections > 0.6) {
    guidelines.push('- Bring up concerns proactively without prompting');
  }

  // Availability
  if (persona.availability.busyLevel === 'extreme') {
    guidelines.push('- Constantly remind them you need to go');
    guidelines.push(`- Use phrases like: ${persona.availability.endCallPhrases.slice(0, 2).join(', ')}`);
  } else if (persona.availability.busyLevel === 'high') {
    guidelines.push('- Occasionally mention time constraints');
  }

  return guidelines.length > 0 ? guidelines.join('\n') : '- Respond naturally based on the conversation';
}

/**
 * Generate objection guidelines based on state.
 */
function generateObjectionGuidelines(persona: PersonaDefinition, state: PersonaState): string {
  const remainingObjections = persona.objections.enabledObjections.filter(
    (o) => !state.raisedObjections.includes(o)
  );

  let guidelines = `Objection frequency: ${persona.objections.frequency}\n`;
  guidelines += `Persistence level: ${Math.round(persona.objections.persistence * 100)}%\n\n`;

  if (state.raisedObjections.length > 0) {
    guidelines += `Objections already raised (can reference again if persistent): ${state.raisedObjections.join(', ')}\n`;
  }

  if (remainingObjections.length > 0) {
    guidelines += `Available new objections: ${remainingObjections.slice(0, 3).join(', ')}\n`;
  }

  return guidelines;
}

/**
 * Get a descriptive label for mood score.
 */
function getMoodDescriptor(score: number): string {
  if (score < 20) return 'Very Negative (hostile/dismissive)';
  if (score < 40) return 'Negative (skeptical/annoyed)';
  if (score < 60) return 'Neutral (guarded but listening)';
  if (score < 80) return 'Positive (engaged/interested)';
  return 'Very Positive (receptive/warm)';
}

/**
 * Get a descriptive label for trust level.
 */
function getTrustDescriptor(level: number): string {
  if (level < 20) return 'No Trust (defensive)';
  if (level < 40) return 'Low Trust (skeptical)';
  if (level < 60) return 'Neutral Trust (evaluating)';
  if (level < 80) return 'Growing Trust (opening up)';
  return 'High Trust (receptive to next steps)';
}

/**
 * Generate a user message that includes conversation context.
 * @param traineeMessage - What the trainee said
 * @param conversationHistory - Recent messages for context
 * @returns Formatted user message for Claude
 */
export function formatTraineeMessage(
  traineeMessage: string,
  conversationHistory: Array<{ role: 'trainee' | 'prospect'; content: string }> = []
): string {
  if (conversationHistory.length === 0) {
    return `[Trainee's opening line - this is a cold call]\n\nTrainee: "${traineeMessage}"`;
  }

  // Include last few exchanges for context
  const recentHistory = conversationHistory.slice(-4);
  const historyText = recentHistory
    .map((msg) => `${msg.role === 'trainee' ? 'Trainee' : 'You'}: "${msg.content}"`)
    .join('\n');

  return `[Recent conversation]\n${historyText}\n\n[Trainee's latest response]\nTrainee: "${traineeMessage}"`;
}

/**
 * Opening prompt for when the "prospect" answers the phone.
 */
export function generateOpeningPrompt(persona: PersonaDefinition): string {
  const openings: Record<string, string[]> = {
    skeptical: [
      'Yeah?',
      'Who is this?',
      'This is [name], what do you need?',
      '[name] speaking.',
    ],
    busy: [
      "I've got about 30 seconds.",
      'Make it quick.',
      '[name], I\'m between meetings.',
      'Yeah, go ahead, but I\'m on my way out.',
    ],
    interested: [
      'Hello, this is [name].',
      '[name] speaking, how can I help?',
      'Yes, hello?',
    ],
    hostile: [
      'What.',
      '*sigh* Who is this and how did you get this number?',
      'If this is a sales call...',
    ],
    friendly: [
      'Hey there, [name] speaking!',
      'Hello! This is [name], what can I do for you?',
      '[name] here, how can I help?',
    ],
  };

  const options = openings[persona.personality] || openings.interested;
  const selected = options[Math.floor(Math.random() * options.length)];
  return selected.replace('[name]', persona.name.split(' ')[0]);
}

/**
 * Construct the messages array for Claude API.
 */
export function buildConversationMessages(
  persona: PersonaDefinition,
  state: PersonaState,
  conversationHistory: Array<{ role: 'trainee' | 'prospect'; content: string }>,
  latestTraineeMessage: string
): Array<{ role: 'user' | 'assistant'; content: string }> {
  const messages: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  // Add conversation history
  for (const msg of conversationHistory) {
    if (msg.role === 'trainee') {
      messages.push({ role: 'user', content: `Trainee: "${msg.content}"` });
    } else {
      messages.push({ role: 'assistant', content: msg.content });
    }
  }

  // Add latest message
  messages.push({
    role: 'user',
    content: `Trainee: "${latestTraineeMessage}"`,
  });

  return messages;
}
