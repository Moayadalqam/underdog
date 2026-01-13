// ===========================================
// Curriculum Page (Stream 3)
// ===========================================
// Owner: Stream 3 (Curriculum & Content)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CURRICULUM_MODULES_COUNT } from '@underdog/core';

export default function CurriculumPage() {
  // Placeholder module data
  const modules = Array.from({ length: CURRICULUM_MODULES_COUNT }, (_, i) => ({
    number: i + 1,
    title: `Module ${i + 1}`,
    description: 'Module content will be imported from client curriculum',
    progress: 0,
  }));

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Training Curriculum</h1>
        <p className="mt-2 text-muted-foreground">
          12-module cold calling training program
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((module) => (
          <Card key={module.number} className="hover:border-primary/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg">
                Module {module.number}
              </CardTitle>
              <CardDescription>{module.title}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{module.progress}%</span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary transition-all"
                  style={{ width: `${module.progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* TODO: Import and display actual curriculum content */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">
          Curriculum content will be imported by Stream 3
        </p>
      </div>
    </main>
  );
}
