// ===========================================
// Organizations Management Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { OrganizationWithStats } from '@underdog/admin';

// Mock data for development
const mockOrganizations: OrganizationWithStats[] = [
  {
    id: 'org1',
    name: 'Acme Corporation',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userCount: 45,
    activeSessionCount: 3,
    totalSessions: 567,
  },
  {
    id: 'org2',
    name: 'Global Sales Inc',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    userCount: 28,
    activeSessionCount: 2,
    totalSessions: 234,
  },
  {
    id: 'org3',
    name: 'Tech Solutions Ltd',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    userCount: 12,
    activeSessionCount: 0,
    totalSessions: 89,
  },
];

export default function OrganizationsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Organizations</h1>
        <button className="btn btn-primary">Add Organization</button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search organizations..."
          className="w-full max-w-md px-4 py-2 border rounded-md"
        />
      </div>

      {/* Organizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockOrganizations.map((org) => (
          <OrganizationCard key={org.id} organization={org} />
        ))}
      </div>
    </div>
  );
}

function OrganizationCard({ organization }: { organization: OrganizationWithStats }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold">{organization.name}</h3>
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
          <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-2xl font-bold text-gray-900">{organization.userCount}</div>
          <div className="text-xs text-gray-500">Users</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{organization.activeSessionCount}</div>
          <div className="text-xs text-gray-500">Active</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{organization.totalSessions}</div>
          <div className="text-xs text-gray-500">Sessions</div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t text-sm text-gray-500">
        Created {organization.createdAt.toLocaleDateString()}
      </div>
    </div>
  );
}
