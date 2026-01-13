// ===========================================
// Admin Dashboard Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { DashboardStats, ActivityItem } from '@underdog/admin';
import { formatRelativeTime, getActivityTypeIcon } from '@underdog/admin';

// Mock data for development
const mockStats: DashboardStats = {
  totalUsers: 156,
  totalOrganizations: 12,
  activeSessions: 8,
  totalSessions: 1234,
  totalRecordings: 567,
  usersByRole: { admin: 5, trainer: 23, trainee: 128 },
  recentActivity: [],
};

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    type: 'session_completed',
    userId: 'u1',
    userName: 'John Smith',
    description: 'Completed roleplay session',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
  },
  {
    id: '2',
    type: 'recording_uploaded',
    userId: 'u2',
    userName: 'Sarah Johnson',
    description: 'Uploaded recording: call_2024_01.mp3',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    id: '3',
    type: 'user_created',
    userId: 'u3',
    userName: 'Admin User',
    description: 'Created user Mike Wilson',
    timestamp: new Date(Date.now() - 60 * 60 * 1000),
  },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Total Users" value={mockStats.totalUsers} />
        <StatCard label="Organizations" value={mockStats.totalOrganizations} />
        <StatCard label="Active Sessions" value={mockStats.activeSessions} />
        <StatCard label="Total Recordings" value={mockStats.totalRecordings} />
      </div>

      {/* Users by Role */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="stat-card">
          <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
          <div className="space-y-4">
            <RoleBar label="Admins" count={mockStats.usersByRole.admin} total={mockStats.totalUsers} color="bg-purple-500" />
            <RoleBar label="Trainers" count={mockStats.usersByRole.trainer} total={mockStats.totalUsers} color="bg-blue-500" />
            <RoleBar label="Trainees" count={mockStats.usersByRole.trainee} total={mockStats.totalUsers} color="bg-green-500" />
          </div>
        </div>

        <div className="stat-card">
          <h2 className="text-lg font-semibold mb-4">Session Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="stat-value">{mockStats.totalSessions}</div>
              <div className="stat-label">Total Sessions</div>
            </div>
            <div>
              <div className="stat-value">{mockStats.activeSessions}</div>
              <div className="stat-label">Active Now</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="stat-card">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {mockActivity.map((activity) => (
            <div key={activity.id} className="flex items-start">
              <span className="text-xl mr-3">{getActivityTypeIcon(activity.type)}</span>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">
                  {activity.userName} • {formatRelativeTime(activity.timestamp)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="stat-card">
      <div className="stat-value">{value.toLocaleString()}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function RoleBar({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>{label}</span>
        <span className="text-gray-500">{count}</span>
      </div>
      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`h-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
