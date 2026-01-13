'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  BookOpen,
  BarChart3,
  FileAudio,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

const navItems = [
  { href: '/roleplay', label: 'Role-Play', icon: Mic },
  { href: '/curriculum', label: 'Curriculum', icon: BookOpen },
  { href: '/objections', label: 'Objections', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/recordings', label: 'Recordings', icon: FileAudio },
];

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50"
    >
      <nav className="mx-4 mt-4">
        <div className="glass-card rounded-2xl px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <Image src="/logo.jpg" alt="Underdog" width={40} height={40} className="rounded-xl shadow-lg shadow-cyan/20 group-hover:shadow-cyan/40 transition-shadow" />
              <span className="font-bold text-xl hidden sm:block">
                <span className="gradient-text">Underdog</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'text-primary'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-xl"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon size={18} />
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {!loading && (
                <>
                  {user ? (
                    <>
                      <Button variant="ghost" size="icon" className="hidden md:flex">
                        <Settings size={20} />
                      </Button>
                      {/* User menu */}
                      <div className="relative">
                        <button
                          onClick={() => setUserMenuOpen(!userMenuOpen)}
                          className={cn(
                            'flex items-center gap-2 px-3 py-2 rounded-xl',
                            'hover:bg-accent/10 transition-colors'
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {user.user_metadata?.name?.[0]?.toUpperCase() ||
                                user.email?.[0]?.toUpperCase() ||
                                'U'}
                            </span>
                          </div>
                          <span className="hidden sm:block text-sm font-medium max-w-[100px] truncate">
                            {user.user_metadata?.name || user.email?.split('@')[0]}
                          </span>
                        </button>

                        <AnimatePresence>
                          {userMenuOpen && (
                            <motion.div
                              initial={{ opacity: 0, y: -10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -10, scale: 0.95 }}
                              className="absolute right-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-xl overflow-hidden"
                            >
                              <div className="px-4 py-3 border-b border-border">
                                <p className="text-sm font-medium truncate">
                                  {user.user_metadata?.name || 'User'}
                                </p>
                                <p className="text-xs text-muted-foreground truncate">
                                  {user.email}
                                </p>
                              </div>
                              <div className="p-2">
                                <Link
                                  href="/settings"
                                  onClick={() => setUserMenuOpen(false)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-accent/10 transition-colors"
                                >
                                  <Settings size={16} />
                                  Settings
                                </Link>
                                <button
                                  onClick={() => {
                                    signOut();
                                    setUserMenuOpen(false);
                                  }}
                                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 transition-colors"
                                >
                                  <LogOut size={16} />
                                  Sign out
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" size="sm" className="hidden sm:flex">
                          Sign In
                        </Button>
                      </Link>
                      <Link href="/signup">
                        <Button variant="gradient" size="sm" className="hidden sm:flex">
                          Get Started
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>

          {/* Mobile Nav */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden mt-4 pt-4 border-t border-border"
            >
              <div className="flex flex-col gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary/10 text-primary'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                      )}
                    >
                      <Icon size={20} />
                      {item.label}
                    </Link>
                  );
                })}
                {user ? (
                  <button
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition-colors mt-2"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                ) : (
                  <div className="flex flex-col gap-2 mt-2">
                    <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="gradient" className="w-full">
                        Get Started
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </nav>
    </motion.header>
  );
}
