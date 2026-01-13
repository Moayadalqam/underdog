'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Lock,
  Bell,
  Moon,
  Sun,
  Volume2,
  Mic,
  Shield,
  CreditCard,
  LogOut,
  Save,
  Loader2,
  Check,
  Camera,
  BarChart3,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

type SettingsTab = 'profile' | 'account' | 'preferences' | 'notifications' | 'billing';

const tabs = [
  { id: 'profile' as const, label: 'Profile', icon: User },
  { id: 'account' as const, label: 'Account', icon: Shield },
  { id: 'preferences' as const, label: 'Preferences', icon: Volume2 },
  { id: 'notifications' as const, label: 'Notifications', icon: Bell },
  { id: 'billing' as const, label: 'Billing', icon: CreditCard },
];

export default function SettingsPage() {
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Profile state
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [email] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('Sales Representative');

  // Preferences state
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('dark');
  const [voiceSpeed, setVoiceSpeed] = useState(1.0);
  const [autoRecord, setAutoRecord] = useState(true);
  const [showTranscript, setShowTranscript] = useState(true);

  // Notification state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [sessionReminders, setSessionReminders] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  const [achievementAlerts, setAchievementAlerts] = useState(true);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">
              <span className="gradient-text">Settings</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Manage your account and preferences
            </p>
          </FadeIn>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Sidebar */}
            <FadeIn className="lg:w-64 shrink-0">
              <GlassCard className="p-2">
                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-primary/10 text-primary'
                            : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                        )}
                      >
                        <Icon size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-border">
                    <button
                      onClick={() => signOut()}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </nav>
              </GlassCard>
            </FadeIn>

            {/* Content */}
            <div className="flex-1">
              <GlassCard className="p-6 lg:p-8">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Profile Information</h2>
                      <p className="text-sm text-muted-foreground">
                        Update your personal information and profile picture
                      </p>
                    </div>

                    {/* Avatar */}
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                          <span className="text-white text-3xl font-bold">
                            {name?.[0]?.toUpperCase() || email?.[0]?.toUpperCase() || 'U'}
                          </span>
                        </div>
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary/90 transition-colors">
                          <Camera size={14} />
                        </button>
                      </div>
                      <div>
                        <p className="font-medium">{name || 'Add your name'}</p>
                        <p className="text-sm text-muted-foreground">{email}</p>
                      </div>
                    </div>

                    {/* Form */}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium mb-2">Full Name</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="John Doe"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl bg-background/50',
                            'border border-border focus:border-primary',
                            'focus:outline-none focus:ring-1 focus:ring-primary',
                            'transition-colors'
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          disabled
                          className={cn(
                            'w-full px-4 py-3 rounded-xl bg-background/50',
                            'border border-border text-muted-foreground',
                            'cursor-not-allowed'
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="+1 (555) 000-0000"
                          className={cn(
                            'w-full px-4 py-3 rounded-xl bg-background/50',
                            'border border-border focus:border-primary',
                            'focus:outline-none focus:ring-1 focus:ring-primary',
                            'transition-colors'
                          )}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company</label>
                        <input
                          type="text"
                          value={company}
                          onChange={(e) => setCompany(e.target.value)}
                          placeholder="Acme Inc."
                          className={cn(
                            'w-full px-4 py-3 rounded-xl bg-background/50',
                            'border border-border focus:border-primary',
                            'focus:outline-none focus:ring-1 focus:ring-primary',
                            'transition-colors'
                          )}
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium mb-2">Role</label>
                        <select
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className={cn(
                            'w-full px-4 py-3 rounded-xl bg-background/50',
                            'border border-border focus:border-primary',
                            'focus:outline-none focus:ring-1 focus:ring-primary',
                            'transition-colors'
                          )}
                        >
                          <option>Sales Representative</option>
                          <option>Sales Manager</option>
                          <option>Account Executive</option>
                          <option>Business Development</option>
                          <option>Sales Director</option>
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Account Tab */}
                {activeTab === 'account' && (
                  <motion.div
                    key="account"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Account Security</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your password and security settings
                      </p>
                    </div>

                    {/* Change Password */}
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Lock size={20} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">Change Password</h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Update your password to keep your account secure
                          </p>
                          <div className="space-y-3">
                            <input
                              type="password"
                              placeholder="Current password"
                              className={cn(
                                'w-full px-4 py-3 rounded-xl bg-background/50',
                                'border border-border focus:border-primary',
                                'focus:outline-none focus:ring-1 focus:ring-primary',
                                'transition-colors'
                              )}
                            />
                            <input
                              type="password"
                              placeholder="New password"
                              className={cn(
                                'w-full px-4 py-3 rounded-xl bg-background/50',
                                'border border-border focus:border-primary',
                                'focus:outline-none focus:ring-1 focus:ring-primary',
                                'transition-colors'
                              )}
                            />
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className={cn(
                                'w-full px-4 py-3 rounded-xl bg-background/50',
                                'border border-border focus:border-primary',
                                'focus:outline-none focus:ring-1 focus:ring-primary',
                                'transition-colors'
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Two-Factor Auth */}
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                            <Shield size={20} />
                          </div>
                          <div>
                            <h3 className="font-medium">Two-Factor Authentication</h3>
                            <p className="text-sm text-muted-foreground">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Enable
                        </Button>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-4 rounded-xl border border-red-500/20 bg-red-500/5">
                      <h3 className="font-medium text-red-500 mb-2">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Permanently delete your account and all associated data
                      </p>
                      <Button variant="destructive" size="sm">
                        Delete Account
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* Preferences Tab */}
                {activeTab === 'preferences' && (
                  <motion.div
                    key="preferences"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Preferences</h2>
                      <p className="text-sm text-muted-foreground">
                        Customize your training experience
                      </p>
                    </div>

                    {/* Theme */}
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                          </div>
                          <div>
                            <h3 className="font-medium">Appearance</h3>
                            <p className="text-sm text-muted-foreground">
                              Choose your preferred theme
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {(['light', 'dark', 'system'] as const).map((t) => (
                            <button
                              key={t}
                              onClick={() => setTheme(t)}
                              className={cn(
                                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                                theme === t
                                  ? 'bg-primary text-white'
                                  : 'bg-muted hover:bg-muted/80'
                              )}
                            >
                              {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Voice Speed */}
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-cyan/10 flex items-center justify-center text-cyan">
                          <Volume2 size={20} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-medium">AI Voice Speed</h3>
                            <span className="text-sm text-muted-foreground">{voiceSpeed}x</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-4">
                            Adjust how fast the AI speaks during role-play
                          </p>
                          <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={voiceSpeed}
                            onChange={(e) => setVoiceSpeed(parseFloat(e.target.value))}
                            className="w-full accent-primary"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-1">
                            <span>0.5x</span>
                            <span>1x</span>
                            <span>1.5x</span>
                            <span>2x</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Toggle Options */}
                    <div className="space-y-3">
                      <ToggleOption
                        icon={Mic}
                        title="Auto-Record Sessions"
                        description="Automatically record all role-play sessions"
                        enabled={autoRecord}
                        onChange={setAutoRecord}
                      />
                      <ToggleOption
                        icon={Mail}
                        title="Live Transcript"
                        description="Show real-time transcript during calls"
                        enabled={showTranscript}
                        onChange={setShowTranscript}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Notifications Tab */}
                {activeTab === 'notifications' && (
                  <motion.div
                    key="notifications"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Notifications</h2>
                      <p className="text-sm text-muted-foreground">
                        Choose what updates you want to receive
                      </p>
                    </div>

                    <div className="space-y-3">
                      <ToggleOption
                        icon={Mail}
                        title="Email Notifications"
                        description="Receive updates and reminders via email"
                        enabled={emailNotifications}
                        onChange={setEmailNotifications}
                      />
                      <ToggleOption
                        icon={Bell}
                        title="Session Reminders"
                        description="Get reminded about scheduled training sessions"
                        enabled={sessionReminders}
                        onChange={setSessionReminders}
                      />
                      <ToggleOption
                        icon={BarChart3}
                        title="Weekly Progress Reports"
                        description="Receive weekly summaries of your performance"
                        enabled={weeklyReports}
                        onChange={setWeeklyReports}
                        iconComponent={
                          <div className="w-10 h-10 rounded-lg bg-magenta/10 flex items-center justify-center text-magenta">
                            <Bell size={20} />
                          </div>
                        }
                      />
                      <ToggleOption
                        icon={Bell}
                        title="Achievement Alerts"
                        description="Get notified when you unlock achievements"
                        enabled={achievementAlerts}
                        onChange={setAchievementAlerts}
                      />
                    </div>
                  </motion.div>
                )}

                {/* Billing Tab */}
                {activeTab === 'billing' && (
                  <motion.div
                    key="billing"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-xl font-semibold mb-1">Billing & Subscription</h2>
                      <p className="text-sm text-muted-foreground">
                        Manage your subscription and payment methods
                      </p>
                    </div>

                    {/* Current Plan */}
                    <div className="p-6 rounded-xl border-2 border-primary bg-primary/5">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary text-white">
                            Current Plan
                          </span>
                          <h3 className="text-2xl font-bold mt-2">Professional</h3>
                          <p className="text-muted-foreground">$49/month</p>
                        </div>
                        <Button variant="outline">Change Plan</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Sessions this month</p>
                          <p className="font-semibold">24 / Unlimited</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Recording storage</p>
                          <p className="font-semibold">2.4 GB / 10 GB</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Next billing date</p>
                          <p className="font-semibold">Feb 1, 2026</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Status</p>
                          <p className="font-semibold text-green-500">Active</p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div className="p-4 rounded-xl border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 rounded bg-gradient-to-r from-blue-600 to-blue-400 flex items-center justify-center">
                            <span className="text-white text-xs font-bold">VISA</span>
                          </div>
                          <div>
                            <p className="font-medium">•••• •••• •••• 4242</p>
                            <p className="text-sm text-muted-foreground">Expires 12/26</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>

                    {/* Billing History */}
                    <div>
                      <h3 className="font-medium mb-3">Billing History</h3>
                      <div className="rounded-xl border border-border overflow-hidden">
                        <table className="w-full text-sm">
                          <thead className="bg-muted/50">
                            <tr>
                              <th className="text-left px-4 py-3 font-medium">Date</th>
                              <th className="text-left px-4 py-3 font-medium">Description</th>
                              <th className="text-right px-4 py-3 font-medium">Amount</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-border">
                            <tr>
                              <td className="px-4 py-3">Jan 1, 2026</td>
                              <td className="px-4 py-3">Professional Plan</td>
                              <td className="px-4 py-3 text-right">$49.00</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Dec 1, 2025</td>
                              <td className="px-4 py-3">Professional Plan</td>
                              <td className="px-4 py-3 text-right">$49.00</td>
                            </tr>
                            <tr>
                              <td className="px-4 py-3">Nov 1, 2025</td>
                              <td className="px-4 py-3">Professional Plan</td>
                              <td className="px-4 py-3 text-right">$49.00</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Save Button */}
                <div className="flex justify-end mt-8 pt-6 border-t border-border">
                  <Button
                    variant="gradient"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <Loader2 size={18} className="mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : saved ? (
                      <>
                        <Check size={18} className="mr-2" />
                        Saved!
                      </>
                    ) : (
                      <>
                        <Save size={18} className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper component for toggle options
function ToggleOption({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
  iconComponent,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (value: boolean) => void;
  iconComponent?: React.ReactNode;
}) {
  return (
    <div className="p-4 rounded-xl border border-border">
      <div className="flex items-center justify-between">
        <div className="flex items-start gap-4">
          {iconComponent || (
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Icon size={20} />
            </div>
          )}
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <button
          onClick={() => onChange(!enabled)}
          className={cn(
            'relative w-12 h-6 rounded-full transition-colors',
            enabled ? 'bg-primary' : 'bg-muted'
          )}
        >
          <motion.div
            animate={{ x: enabled ? 24 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
          />
        </button>
      </div>
    </div>
  );
}
