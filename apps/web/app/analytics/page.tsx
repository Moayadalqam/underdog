// ===========================================
// Analytics Page (Stream 4)
// ===========================================
// Owner: Stream 4 (Analytics & Feedback)

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AnalyticsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Performance Analytics</h1>
        <p className="mt-2 text-muted-foreground">
          Track your progress and identify areas for improvement
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Sessions" value="0" description="Total training sessions" />
        <StatsCard title="Average Score" value="--" description="Overall performance" />
        <StatsCard title="Time Trained" value="0h" description="Total practice time" />
        <StatsCard title="Streak" value="0 days" description="Current streak" />
      </div>

      {/* Score Breakdown */}
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Score Breakdown</CardTitle>
            <CardDescription>Performance by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ScoreBar label="Opening" score={0} />
              <ScoreBar label="Discovery" score={0} />
              <ScoreBar label="Objection Handling" score={0} />
              <ScoreBar label="Closing" score={0} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest training activities</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No sessions yet. Start practicing to see your progress!
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TODO: Implement charts and detailed analytics */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">
          Detailed analytics and charts will be implemented by Stream 4
        </p>
      </div>
    </main>
  );
}

function StatsCard({
  title,
  value,
  description,
}: {
  title: string;
  value: string;
  description: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="font-medium">{score}%</span>
      </div>
      <div className="h-2 rounded-full bg-secondary">
        <div
          className="h-2 rounded-full bg-primary transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
