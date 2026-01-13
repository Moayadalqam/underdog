// ===========================================
// Users Management Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { UserWithDetails } from '@underdog/admin';
import { getRoleDisplayName } from '@underdog/admin';

// Mock data for development
const mockUsers: UserWithDetails[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    organizationId: 'org1',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    sessionCount: 0,
    lastActiveAt: new Date(),
  },
  {
    id: '2',
    email: 'john.smith@company.com',
    name: 'John Smith',
    role: 'trainer',
    organizationId: 'org1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    sessionCount: 45,
    lastActiveAt: new Date(Date.now() - 3600000),
  },
  {
    id: '3',
    email: 'sarah.johnson@company.com',
    name: 'Sarah Johnson',
    role: 'trainee',
    organizationId: 'org1',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    sessionCount: 12,
    lastActiveAt: new Date(Date.now() - 86400000),
  },
];

export default function UsersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
        <button className="btn btn-primary">Add User</button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search users..."
          className="flex-1 px-4 py-2 border rounded-md"
        />
        <select className="px-4 py-2 border rounded-md">
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="trainer">Trainer</option>
          <option value="trainee">Trainee</option>
        </select>
      </div>

      {/* Users Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Sessions</th>
            <th>Last Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.map((user) => (
            <tr key={user.id}>
              <td className="font-medium">{user.name}</td>
              <td>{user.email}</td>
              <td>
                <RoleBadge role={user.role} />
              </td>
              <td>{user.sessionCount}</td>
              <td>{user.lastActiveAt ? formatDate(user.lastActiveAt) : 'Never'}</td>
              <td>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800">Edit</button>
                  <button className="text-red-600 hover:text-red-800">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-500">
          Showing 1-{mockUsers.length} of {mockUsers.length} users
        </span>
        <div className="flex gap-2">
          <button className="btn btn-secondary" disabled>Previous</button>
          <button className="btn btn-secondary" disabled>Next</button>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: 'admin' | 'trainer' | 'trainee' }) {
  const colors = {
    admin: 'badge-purple bg-purple-100 text-purple-800',
    trainer: 'badge-blue bg-blue-100 text-blue-800',
    trainee: 'badge-green bg-green-100 text-green-800',
  };
  return (
    <span className={`badge ${colors[role]}`}>
      {getRoleDisplayName(role)}
    </span>
  );
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
