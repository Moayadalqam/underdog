'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  BookOpen,
  Mic,
  BarChart3,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Shield,
  TrendingUp,
  TrendingDown,
  Activity,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Filter,
  Download,
  RefreshCw,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

type AdminTab = 'overview' | 'users' | 'content' | 'analytics' | 'settings';

const tabs = [
  { id: 'overview' as const, label: 'Overview', icon: BarChart3 },
  { id: 'users' as const, label: 'Users', icon: Users },
  { id: 'content' as const, label: 'Content', icon: BookOpen },
  { id: 'analytics' as const, label: 'Analytics', icon: Activity },
  { id: 'settings' as const, label: 'Settings', icon: Settings },
];

// Mock data
const stats = [
  { label: 'Total Users', value: '1,247', change: '+12%', trend: 'up', icon: Users },
  { label: 'Active Sessions', value: '89', change: '+5%', trend: 'up', icon: Mic },
  { label: 'Modules Completed', value: '3,842', change: '+18%', trend: 'up', icon: CheckCircle2 },
  { label: 'Avg. Session Time', value: '24 min', change: '-3%', trend: 'down', icon: Clock },
];

const recentUsers = [
  { id: 1, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Sales Rep', status: 'active', progress: 75, lastActive: '2 min ago' },
  { id: 2, name: 'Mike Chen', email: 'mike@company.com', role: 'Sales Manager', status: 'active', progress: 90, lastActive: '15 min ago' },
  { id: 3, name: 'Emily Davis', email: 'emily@company.com', role: 'Sales Rep', status: 'inactive', progress: 45, lastActive: '2 days ago' },
  { id: 4, name: 'James Wilson', email: 'james@company.com', role: 'Sales Rep', status: 'active', progress: 30, lastActive: '1 hour ago' },
  { id: 5, name: 'Lisa Brown', email: 'lisa@company.com', role: 'Team Lead', status: 'active', progress: 100, lastActive: '5 min ago' },
];

const systemAlerts = [
  { id: 1, type: 'warning', message: 'High server load detected', time: '10 min ago' },
  { id: 2, type: 'info', message: '5 new users registered today', time: '1 hour ago' },
  { id: 3, type: 'success', message: 'System backup completed', time: '3 hours ago' },
];

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold">
                  Admin <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Manage users, content, and monitor platform activity
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Export
                </Button>
                <Button variant="gradient" size="sm">
                  <Plus size={16} className="mr-2" />
                  Add User
                </Button>
              </div>
            </div>
          </FadeIn>

          {/* Tabs */}
          <FadeIn delay={0.1} className="mb-6">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap',
                      isActive
                        ? 'bg-primary text-white'
                        : 'bg-card border border-border hover:border-primary/50'
                    )}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </FadeIn>

          <AnimatePresence mode="wait">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {/* Stats Grid */}
                <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
                  {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <StaggerItem key={stat.label}>
                        <GlassCard className="p-6">
                          <div className="flex items-start justify-between">
                            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon size={24} className="text-primary" />
                            </div>
                            <div className={cn(
                              'flex items-center gap-1 text-sm font-medium',
                              stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                            )}>
                              {stat.trend === 'up' ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                              {stat.change}
                            </div>
                          </div>
                          <p className="mt-4 text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.label}</p>
                        </GlassCard>
                      </StaggerItem>
                    );
                  })}
                </StaggerContainer>

                <div className="grid lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Users</h2>
                        <Button variant="ghost" size="sm">
                          View All
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {recentUsers.slice(0, 5).map((user) => (
                          <div
                            key={user.id}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                          >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                              <span className="text-white font-medium">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">{user.name}</p>
                              <p className="text-sm text-muted-foreground truncate">
                                {user.email}
                              </p>
                            </div>
                            <div className="hidden sm:block text-right">
                              <p className="text-sm font-medium">{user.progress}%</p>
                              <p className="text-xs text-muted-foreground">{user.lastActive}</p>
                            </div>
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              user.status === 'active' ? 'bg-green-500' : 'bg-muted-foreground'
                            )} />
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>

                  {/* System Alerts */}
                  <div>
                    <GlassCard className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">System Alerts</h2>
                        <Button variant="ghost" size="icon">
                          <RefreshCw size={16} />
                        </Button>
                      </div>
                      <div className="space-y-3">
                        {systemAlerts.map((alert) => (
                          <div
                            key={alert.id}
                            className={cn(
                              'p-3 rounded-xl border',
                              alert.type === 'warning' && 'border-yellow-500/20 bg-yellow-500/5',
                              alert.type === 'info' && 'border-blue-500/20 bg-blue-500/5',
                              alert.type === 'success' && 'border-green-500/20 bg-green-500/5'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {alert.type === 'warning' && <AlertTriangle size={16} className="text-yellow-500 mt-0.5" />}
                              {alert.type === 'info' && <Activity size={16} className="text-blue-500 mt-0.5" />}
                              {alert.type === 'success' && <CheckCircle2 size={16} className="text-green-500 mt-0.5" />}
                              <div className="flex-1">
                                <p className="text-sm">{alert.message}</p>
                                <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  {/* Search and Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                          'w-full pl-10 pr-4 py-2 rounded-xl bg-background/50',
                          'border border-border focus:border-primary',
                          'focus:outline-none focus:ring-1 focus:ring-primary'
                        )}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Filter size={16} className="mr-2" />
                        Filter
                      </Button>
                      <Button variant="gradient" size="sm">
                        <Plus size={16} className="mr-2" />
                        Add User
                      </Button>
                    </div>
                  </div>

                  {/* Users Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                            <input
                              type="checkbox"
                              className="rounded border-border"
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedUsers(recentUsers.map((u) => u.id));
                                } else {
                                  setSelectedUsers([]);
                                }
                              }}
                            />
                          </th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">User</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Role</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Progress</th>
                          <th className="text-left py-3 px-4 font-medium text-muted-foreground">Last Active</th>
                          <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentUsers.map((user) => (
                          <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30">
                            <td className="py-3 px-4">
                              <input
                                type="checkbox"
                                className="rounded border-border"
                                checked={selectedUsers.includes(user.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedUsers([...selectedUsers, user.id]);
                                  } else {
                                    setSelectedUsers(selectedUsers.filter((id) => id !== user.id));
                                  }
                                }}
                              />
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                                  <span className="text-white text-sm font-medium">
                                    {user.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="font-medium">{user.name}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted">
                                {user.role}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={cn(
                                'px-2 py-1 rounded-full text-xs font-medium',
                                user.status === 'active'
                                  ? 'bg-green-500/10 text-green-500'
                                  : 'bg-muted text-muted-foreground'
                              )}>
                                {user.status}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2">
                                <div className="w-24 h-2 rounded-full bg-muted overflow-hidden">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-cyan to-magenta"
                                    style={{ width: `${user.progress}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">{user.progress}%</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm text-muted-foreground">
                              {user.lastActive}
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon">
                                  <Edit size={16} />
                                </Button>
                                <Button variant="ghost" size="icon">
                                  <Mail size={16} />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500">
                                  <Trash2 size={16} />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground">
                      Showing 1-5 of 1,247 users
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm">
                        Next
                      </Button>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <GlowCard glowColor="cyan" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-cyan/10 flex items-center justify-center">
                        <BookOpen size={24} className="text-cyan" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">12</p>
                        <p className="text-sm text-muted-foreground">Training Modules</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage curriculum modules, lessons, and quizzes
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Modules
                    </Button>
                  </GlowCard>

                  <GlowCard glowColor="magenta" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-magenta/10 flex items-center justify-center">
                        <Shield size={24} className="text-magenta" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-sm text-muted-foreground">Objection Scripts</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Edit objection handling responses and categories
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Objections
                    </Button>
                  </GlowCard>

                  <GlowCard glowColor="cyan" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Users size={24} className="text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">8</p>
                        <p className="text-sm text-muted-foreground">AI Personas</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Configure AI prospect personalities and behaviors
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Personas
                    </Button>
                  </GlowCard>

                  <GlowCard glowColor="magenta" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                        <Mic size={24} className="text-yellow-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-sm text-muted-foreground">Practice Scenarios</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Create and edit role-play practice scenarios
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Scenarios
                    </Button>
                  </GlowCard>

                  <GlowCard glowColor="cyan" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
                        <CheckCircle2 size={24} className="text-green-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">36</p>
                        <p className="text-sm text-muted-foreground">Quizzes & Tests</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Manage assessment questions and scoring
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Assessments
                    </Button>
                  </GlowCard>

                  <GlowCard glowColor="magenta" className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
                        <Download size={24} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-sm text-muted-foreground">Resources & Files</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Upload and manage downloadable resources
                    </p>
                    <Button variant="outline" size="sm" className="w-full">
                      Manage Resources
                    </Button>
                  </GlowCard>
                </div>
              </motion.div>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  <div className="text-center py-12">
                    <BarChart3 size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <h2 className="text-xl font-semibold mb-2">Analytics Dashboard</h2>
                    <p className="text-muted-foreground mb-6">
                      Detailed analytics and reporting coming soon
                    </p>
                    <Button variant="gradient">
                      View Basic Analytics
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <GlassCard className="p-6">
                  <h2 className="text-xl font-semibold mb-6">System Settings</h2>

                  <div className="space-y-6">
                    <div className="p-4 rounded-xl border border-border">
                      <h3 className="font-medium mb-4">Organization</h3>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Company Name</label>
                          <input
                            type="text"
                            defaultValue="Acme Sales Inc."
                            className={cn(
                              'w-full px-4 py-2 rounded-xl bg-background/50',
                              'border border-border focus:border-primary',
                              'focus:outline-none focus:ring-1 focus:ring-primary'
                            )}
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-muted-foreground mb-2">Industry</label>
                          <select className={cn(
                            'w-full px-4 py-2 rounded-xl bg-background/50',
                            'border border-border focus:border-primary',
                            'focus:outline-none focus:ring-1 focus:ring-primary'
                          )}>
                            <option>Software / SaaS</option>
                            <option>Financial Services</option>
                            <option>Healthcare</option>
                            <option>Real Estate</option>
                            <option>Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border">
                      <h3 className="font-medium mb-4">AI Configuration</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Default AI Difficulty</p>
                            <p className="text-sm text-muted-foreground">Set the default difficulty for new users</p>
                          </div>
                          <select className={cn(
                            'px-4 py-2 rounded-xl bg-background/50',
                            'border border-border focus:border-primary'
                          )}>
                            <option>Easy</option>
                            <option>Medium</option>
                            <option>Hard</option>
                          </select>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Auto-Recording</p>
                            <p className="text-sm text-muted-foreground">Automatically record all sessions</p>
                          </div>
                          <button className="relative w-12 h-6 rounded-full bg-primary transition-colors">
                            <motion.div
                              animate={{ x: 24 }}
                              className="absolute top-1 left-0.5 w-4 h-4 rounded-full bg-white shadow-sm"
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                      <h3 className="font-medium text-red-500 mb-4">Danger Zone</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Reset All User Progress</p>
                          <p className="text-sm text-muted-foreground">This action cannot be undone</p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Reset Progress
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6 pt-6 border-t border-border">
                    <Button variant="gradient">
                      Save Settings
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
