// ===========================================
// Database Seed Script
// ===========================================
// Populates the database with curriculum, objections, and personas

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

const contentDir = path.join(__dirname, '../../../content');

interface LessonData {
  id: string;
  moduleId: string;
  title: string;
  order: number;
  content: string;
  objectives?: string[];
  keyPoints?: string[];
}

interface ScenarioData {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  difficulty: number;
  personaHint?: string;
}

interface ModuleData {
  id: string;
  number: number;
  title: string;
  description: string;
  lessons: LessonData[];
  scenarios: ScenarioData[];
}

interface ObjectionData {
  id: string;
  category: string;
  text: string;
  difficulty: number;
  suggestedResponses: { response: string }[];
}

interface ObjectionsFile {
  category: string;
  objections: ObjectionData[];
}

interface PersonaData {
  id: string;
  name: string;
  personality: string;
  mood: {
    floor: string;
    ceiling: string;
  };
  objections: {
    primaryCategory: string;
  };
  responsePatterns: { responses: string[] }[];
  difficulty: number;
}

async function seedCurriculum() {
  console.log('Seeding curriculum modules...');

  const curriculumDir = path.join(contentDir, 'curriculum');
  const files = fs.readdirSync(curriculumDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const data: ModuleData = JSON.parse(
      fs.readFileSync(path.join(curriculumDir, file), 'utf-8')
    );

    // Upsert module
    const curriculumModule = await prisma.curriculumModule.upsert({
      where: { number: data.number },
      update: {
        title: data.title,
        description: data.description,
      },
      create: {
        number: data.number,
        title: data.title,
        description: data.description,
      },
    });

    console.log(`  - Module ${data.number}: ${data.title}`);

    // Seed lessons
    for (const lesson of data.lessons) {
      await prisma.lesson.upsert({
        where: {
          moduleId_order: {
            moduleId: curriculumModule.id,
            order: lesson.order,
          },
        },
        update: {
          title: lesson.title,
          content: lesson.content,
        },
        create: {
          moduleId: curriculumModule.id,
          title: lesson.title,
          content: lesson.content,
          order: lesson.order,
        },
      });
    }
    console.log(`    - ${data.lessons.length} lessons`);

    // Seed scenarios
    for (const scenario of data.scenarios) {
      // Check if scenario exists by title and moduleId
      const existing = await prisma.trainingScenario.findFirst({
        where: {
          moduleId: curriculumModule.id,
          title: scenario.title,
        },
      });

      if (existing) {
        await prisma.trainingScenario.update({
          where: { id: existing.id },
          data: {
            description: scenario.description,
            difficulty: scenario.difficulty,
            personaHint: scenario.personaHint,
          },
        });
      } else {
        await prisma.trainingScenario.create({
          data: {
            moduleId: curriculumModule.id,
            title: scenario.title,
            description: scenario.description,
            difficulty: scenario.difficulty,
            personaHint: scenario.personaHint,
          },
        });
      }
    }
    console.log(`    - ${data.scenarios.length} scenarios`);
  }
}

async function seedObjections() {
  console.log('Seeding objections...');

  const objectionsDir = path.join(contentDir, 'objections');
  const files = fs.readdirSync(objectionsDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const data: ObjectionsFile = JSON.parse(
      fs.readFileSync(path.join(objectionsDir, file), 'utf-8')
    );

    console.log(`  - Category: ${data.category}`);

    for (const objection of data.objections) {
      // Map category string to enum
      const category = data.category as 'common' | 'industry' | 'personality';

      // Find existing by text
      const existing = await prisma.objection.findFirst({
        where: { text: objection.text },
      });

      const suggestedResponses = objection.suggestedResponses.map(r => r.response);

      if (existing) {
        await prisma.objection.update({
          where: { id: existing.id },
          data: {
            category,
            difficulty: objection.difficulty,
            suggestedResponses,
          },
        });
      } else {
        await prisma.objection.create({
          data: {
            category,
            text: objection.text,
            difficulty: objection.difficulty,
            suggestedResponses,
          },
        });
      }
    }

    console.log(`    - ${data.objections.length} objections`);
  }
}

async function seedPersonas() {
  console.log('Seeding AI personas...');

  const personasDir = path.join(contentDir, 'personas');
  const files = fs.readdirSync(personasDir).filter(f => f.endsWith('.json'));

  for (const file of files) {
    const data: PersonaData = JSON.parse(
      fs.readFileSync(path.join(personasDir, file), 'utf-8')
    );

    // Map personality to enum
    const personalityMap: Record<string, 'skeptical' | 'busy' | 'interested' | 'hostile' | 'friendly'> = {
      skeptical: 'skeptical',
      busy: 'busy',
      interested: 'interested',
      hostile: 'hostile',
      friendly: 'friendly',
    };

    const personality = personalityMap[data.personality] || 'interested';

    // Extract response patterns as strings
    const responsePatterns = data.responsePatterns
      .flatMap(rp => rp.responses)
      .slice(0, 10); // Limit to 10 patterns

    // Map objection style to category
    const objectionStyleMap: Record<string, string> = {
      common: 'common',
      personality: 'personality',
      industry: 'industry',
    };
    const objectionStyle = objectionStyleMap[data.objections?.primaryCategory] || 'common';

    // Find existing by name
    const existing = await prisma.aIPersona.findFirst({
      where: { name: data.name },
    });

    const personaData = {
      name: data.name,
      personality,
      moodMin: data.mood.floor,
      moodMax: data.mood.ceiling,
      objectionStyle,
      responsePatterns,
    };

    if (existing) {
      await prisma.aIPersona.update({
        where: { id: existing.id },
        data: personaData,
      });
    } else {
      await prisma.aIPersona.create({
        data: personaData,
      });
    }

    console.log(`  - ${data.name} (${personality})`);
  }
}

async function main() {
  console.log('Starting database seed...\n');

  try {
    await seedCurriculum();
    console.log('');
    await seedObjections();
    console.log('');
    await seedPersonas();
    console.log('\nSeed completed successfully!');
  } catch (error) {
    console.error('Seed failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
