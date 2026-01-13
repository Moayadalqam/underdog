// ===========================================
// Admin App Layout
// ===========================================
// Owner: Stream 6 (Admin Console)

import * as React from 'react';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Underdog Admin',
  description: 'Admin console for Underdog sales training platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <div className="flex min-h-screen">
          {/* Sidebar */}
          <aside className="w-64 bg-gray-900 text-white">
            <div className="p-4">
              <h1 className="text-xl font-bold">Underdog Admin</h1>
            </div>
            <nav className="mt-8">
              <NavLink href="/admin" icon="dashboard">Dashboard</NavLink>
              <NavLink href="/admin/users" icon="users">Users</NavLink>
              <NavLink href="/admin/organizations" icon="building">Organizations</NavLink>
              <NavLink href="/admin/sessions" icon="play">Sessions</NavLink>
              <NavLink href="/admin/recordings" icon="mic">Recordings</NavLink>
              <NavLink href="/admin/system" icon="settings">System</NavLink>
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function NavLink({
  href,
  icon,
  children,
}: {
  href: string;
  icon: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className="flex items-center px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
    >
      <span className="mr-3">{getIcon(icon)}</span>
      {children}
    </a>
  );
}

function getIcon(name: string): string {
  const icons: Record<string, string> = {
    dashboard: '📊',
    users: '👥',
    building: '🏢',
    play: '▶️',
    mic: '🎙️',
    settings: '⚙️',
  };
  return icons[name] ?? '•';
}
