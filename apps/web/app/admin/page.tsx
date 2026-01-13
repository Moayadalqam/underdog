// ===========================================
// Admin Page (Stream 6)
// ===========================================
// Owner: Stream 6 (Admin Console)

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Console</h1>
        <p className="mt-2 text-muted-foreground">
          Manage users, content, and system settings
        </p>
      </div>

      {/* Admin Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AdminStatCard title="Total Users" value="0" />
        <AdminStatCard title="Active Sessions" value="0" />
        <AdminStatCard title="Recordings" value="0" />
        <AdminStatCard title="Organizations" value="0" />
      </div>

      {/* Admin Sections */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <AdminCard
          title="User Management"
          description="Add, edit, and manage user accounts"
          href="/admin/users"
        />
        <AdminCard
          title="Organizations"
          description="Manage organization settings"
          href="/admin/organizations"
        />
        <AdminCard
          title="Content Management"
          description="Edit curriculum and objection library"
          href="/admin/content"
        />
        <AdminCard
          title="AI Configuration"
          description="Configure AI personas and prompts"
          href="/admin/ai"
        />
        <AdminCard
          title="Analytics"
          description="View system-wide usage analytics"
          href="/admin/analytics"
        />
        <AdminCard
          title="System Settings"
          description="Configure platform settings"
          href="/admin/settings"
        />
      </div>

      {/* TODO: Implement admin functionality */}
      <div className="mt-8 rounded-lg border-2 border-dashed border-border p-8 text-center">
        <p className="text-muted-foreground">
          Admin functionality will be implemented by Stream 6
        </p>
      </div>
    </main>
  );
}

function AdminStatCard({ title, value }: { title: string; value: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-3xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  );
}

function AdminCard({
  title,
  description,
  href: _href,
}: {
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Card className="hover:border-primary/50 transition-colors cursor-pointer">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  );
}
