// ===========================================
// System Health Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { SystemHealth, HealthStatus } from '@underdog/admin';
import { getHealthStatusDisplay } from '@underdog/admin';

// Mock data for development
const mockHealth: SystemHealth = {
  database: 'healthy',
  storage: 'healthy',
  aiEngine: 'healthy',
  voiceService: 'degraded',
  transcription: 'healthy',
  overall: 'degraded',
  checkedAt: new Date(),
};

export default function SystemPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Health</h1>
        <button className="btn btn-secondary">Refresh</button>
      </div>

      {/* Overall Status */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Overall Status</h2>
            <p className="text-sm text-gray-500">
              Last checked: {mockHealth.checkedAt.toLocaleTimeString()}
            </p>
          </div>
          <StatusBadge status={mockHealth.overall} large />
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServiceCard name="Database" status={mockHealth.database} description="PostgreSQL via Supabase" />
        <ServiceCard name="Storage" status={mockHealth.storage} description="Supabase Storage for recordings" />
        <ServiceCard name="AI Engine" status={mockHealth.aiEngine} description="Claude API for conversations" />
        <ServiceCard name="Voice Service" status={mockHealth.voiceService} description="Chatterbox TTS / Deepgram STT" />
        <ServiceCard name="Transcription" status={mockHealth.transcription} description="Deepgram transcription API" />
      </div>

      {/* System Information */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">System Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <InfoRow label="Environment" value="Production" />
          <InfoRow label="Region" value="US East" />
          <InfoRow label="Platform Version" value="0.1.0" />
          <InfoRow label="Node.js" value="20.x" />
          <InfoRow label="Next.js" value="15.0" />
          <InfoRow label="Database" value="PostgreSQL 15" />
        </div>
      </div>

      {/* Recent Incidents */}
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Incidents</h2>
        <div className="space-y-4">
          <IncidentRow
            timestamp={new Date(Date.now() - 3600000)}
            service="Voice Service"
            message="High latency detected - automatically switched to fallback provider"
            status="resolved"
          />
          <IncidentRow
            timestamp={new Date(Date.now() - 86400000)}
            service="Database"
            message="Connection pool exhausted - auto-scaled"
            status="resolved"
          />
        </div>
        <p className="text-sm text-gray-500 mt-4">
          No active incidents
        </p>
      </div>
    </div>
  );
}

function ServiceCard({
  name,
  status,
  description,
}: {
  name: string;
  status: HealthStatus;
  description: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold">{name}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-gray-500">{description}</p>
    </div>
  );
}

function StatusBadge({ status, large }: { status: HealthStatus; large?: boolean }) {
  const display = getHealthStatusDisplay(status);
  const colorClasses = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  const sizeClasses = large
    ? 'px-4 py-2 text-base'
    : 'px-2.5 py-0.5 text-xs';

  return (
    <span className={`badge ${colorClasses[display.color as keyof typeof colorClasses]} ${sizeClasses}`}>
      {display.label}
    </span>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-2 border-b border-gray-100">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function IncidentRow({
  timestamp,
  service,
  message,
  status,
}: {
  timestamp: Date;
  service: string;
  message: string;
  status: 'active' | 'resolved';
}) {
  return (
    <div className="flex items-start gap-4 py-2 border-b border-gray-100">
      <span className={`badge ${status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {status}
      </span>
      <div className="flex-1">
        <p className="text-sm font-medium">{service}</p>
        <p className="text-sm text-gray-500">{message}</p>
      </div>
      <span className="text-xs text-gray-400">
        {timestamp.toLocaleString()}
      </span>
    </div>
  );
}
