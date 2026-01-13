// ===========================================
// Recordings Admin Page
// ===========================================
// Owner: Stream 6 (Admin Console)

import type { RecordingStatus } from '@underdog/core';

interface RecordingOverview {
  id: string;
  userId: string;
  userName: string;
  filename: string;
  duration: number;
  status: RecordingStatus;
  uploadedAt: Date;
  score?: number;
}

// Mock data for development
const mockRecordings: RecordingOverview[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'John Smith',
    filename: 'cold_call_prospect_a.mp3',
    duration: 312,
    status: 'analyzed',
    uploadedAt: new Date(Date.now() - 86400000),
    score: 78,
  },
  {
    id: 'r2',
    userId: 'u2',
    userName: 'Sarah Johnson',
    filename: 'discovery_call_jan15.wav',
    duration: 485,
    status: 'transcribed',
    uploadedAt: new Date(Date.now() - 172800000),
  },
  {
    id: 'r3',
    userId: 'u3',
    userName: 'Mike Wilson',
    filename: 'demo_recording.mp3',
    duration: 623,
    status: 'processing',
    uploadedAt: new Date(Date.now() - 3600000),
  },
  {
    id: 'r4',
    userId: 'u1',
    userName: 'John Smith',
    filename: 'followup_call.mp3',
    duration: 0,
    status: 'uploading',
    uploadedAt: new Date(),
  },
];

export default function RecordingsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Recordings</h1>
        <div className="flex gap-4">
          <select className="px-4 py-2 border rounded-md">
            <option value="">All Status</option>
            <option value="uploading">Uploading</option>
            <option value="processing">Processing</option>
            <option value="transcribed">Transcribed</option>
            <option value="analyzed">Analyzed</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Recordings" value={mockRecordings.length} />
        <StatCard label="Pending Analysis" value={mockRecordings.filter(r => r.status !== 'analyzed').length} />
        <StatCard label="Total Duration" value={formatTotalDuration(mockRecordings)} />
        <StatCard label="Avg Score" value={calculateAvgScore(mockRecordings)} />
      </div>

      {/* Recordings Table */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Filename</th>
            <th>User</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Score</th>
            <th>Uploaded</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockRecordings.map((recording) => (
            <tr key={recording.id}>
              <td>
                <div className="flex items-center">
                  <span className="mr-2">🎙️</span>
                  <span className="font-medium truncate max-w-xs">{recording.filename}</span>
                </div>
              </td>
              <td>{recording.userName}</td>
              <td>{formatDuration(recording.duration)}</td>
              <td>
                <StatusBadge status={recording.status} />
              </td>
              <td>
                {recording.score !== undefined ? (
                  <ScoreBadge score={recording.score} />
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td>{recording.uploadedAt.toLocaleDateString()}</td>
              <td>
                <div className="flex gap-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                  <button className="text-green-600 hover:text-green-800 text-sm">Reprocess</button>
                  <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: RecordingStatus }) {
  const config: Record<RecordingStatus, { label: string; class: string }> = {
    uploading: { label: 'Uploading', class: 'bg-blue-100 text-blue-800' },
    processing: { label: 'Processing', class: 'bg-yellow-100 text-yellow-800' },
    transcribed: { label: 'Transcribed', class: 'bg-purple-100 text-purple-800' },
    analyzed: { label: 'Analyzed', class: 'bg-green-100 text-green-800' },
    failed: { label: 'Failed', class: 'bg-red-100 text-red-800' },
  };
  const { label, class: className } = config[status];
  return <span className={`badge ${className}`}>{label}</span>;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600';
  return <span className={`font-semibold ${color}`}>{score}%</span>;
}

function formatDuration(seconds: number): string {
  if (seconds === 0) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function formatTotalDuration(recordings: RecordingOverview[]): string {
  const totalSeconds = recordings.reduce((sum, r) => sum + r.duration, 0);
  const hours = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

function calculateAvgScore(recordings: RecordingOverview[]): string {
  const scored = recordings.filter(r => r.score !== undefined);
  if (scored.length === 0) return '-';
  const avg = scored.reduce((sum, r) => sum + (r.score ?? 0), 0) / scored.length;
  return `${Math.round(avg)}%`;
}
