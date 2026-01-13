// ===========================================
// Sessions Overview Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { SessionType, SessionStatus } from '@underdog/core';

interface SessionOverview {
  id: string;
  userId: string;
  userName: string;
  type: SessionType;
  status: SessionStatus;
  moduleTitle?: string;
  startedAt: Date;
  endedAt?: Date;
  score?: number;
}

// Mock data for development
const mockSessions: SessionOverview[] = [
  {
    id: 's1',
    userId: 'u1',
    userName: 'John Smith',
    type: 'roleplay',
    status: 'active',
    moduleTitle: 'Module 3: Building Rapport',
    startedAt: new Date(Date.now() - 1800000),
  },
  {
    id: 's2',
    userId: 'u2',
    userName: 'Sarah Johnson',
    type: 'roleplay',
    status: 'completed',
    moduleTitle: 'Module 5: Objection Handling',
    startedAt: new Date(Date.now() - 7200000),
    endedAt: new Date(Date.now() - 5400000),
    score: 85,
  },
  {
    id: 's3',
    userId: 'u3',
    userName: 'Mike Wilson',
    type: 'recording_analysis',
    status: 'completed',
    startedAt: new Date(Date.now() - 86400000),
    endedAt: new Date(Date.now() - 82800000),
    score: 72,
  },
];

export default function SessionsPage() {
  const activeSessions = mockSessions.filter(s => s.status === 'active');
  const completedSessions = mockSessions.filter(s => s.status === 'completed');

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Sessions</h1>

      {/* Active Sessions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Active Sessions ({activeSessions.length})
        </h2>
        {activeSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSessions.map((session) => (
              <ActiveSessionCard key={session.id} session={session} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No active sessions</p>
        )}
      </div>

      {/* Recent Sessions */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Recent Sessions</h2>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Type</th>
              <th>Module</th>
              <th>Status</th>
              <th>Duration</th>
              <th>Score</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {completedSessions.map((session) => (
              <tr key={session.id}>
                <td className="font-medium">{session.userName}</td>
                <td>
                  <TypeBadge type={session.type} />
                </td>
                <td>{session.moduleTitle ?? '-'}</td>
                <td>
                  <StatusBadge status={session.status} />
                </td>
                <td>{formatDuration(session.startedAt, session.endedAt)}</td>
                <td>
                  {session.score !== undefined ? (
                    <ScoreBadge score={session.score} />
                  ) : '-'}
                </td>
                <td>{session.startedAt.toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActiveSessionCard({ session }: { session: SessionOverview }) {
  const duration = Math.floor((Date.now() - session.startedAt.getTime()) / 60000);
  return (
    <div className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{session.userName}</span>
        <span className="text-xs text-gray-500">{duration}m</span>
      </div>
      <p className="text-sm text-gray-600">{session.moduleTitle ?? 'Training Session'}</p>
      <TypeBadge type={session.type} />
    </div>
  );
}

function TypeBadge({ type }: { type: SessionType }) {
  const labels: Record<SessionType, string> = {
    roleplay: 'Role-Play',
    recording_analysis: 'Recording Analysis',
  };
  const colors: Record<SessionType, string> = {
    roleplay: 'bg-blue-100 text-blue-800',
    recording_analysis: 'bg-purple-100 text-purple-800',
  };
  return <span className={`badge ${colors[type]}`}>{labels[type]}</span>;
}

function StatusBadge({ status }: { status: SessionStatus }) {
  const colors: Record<SessionStatus, string> = {
    active: 'bg-green-100 text-green-800',
    completed: 'bg-gray-100 text-gray-800',
    abandoned: 'bg-red-100 text-red-800',
  };
  return <span className={`badge ${colors[status]}`}>{status}</span>;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  return <span className={`font-semibold ${color}`}>{score}%</span>;
}

function formatDuration(start: Date, end?: Date): string {
  if (!end) return '-';
  const diffMs = end.getTime() - start.getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
