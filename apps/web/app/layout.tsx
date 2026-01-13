import * as React from 'react';
import type { Metadata } from 'next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Providers } from '@/components/providers';
import './globals.css';

export const metadata: Metadata = {
  title: 'Underdog AI - Sales Training Platform',
  description: 'AI-powered cold calling practice and sales training',
  icons: {
    icon: '/logo.jpg',
    apple: '/logo.jpg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          {/* Background gradient */}
          <div className="fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-[40%] -right-[20%] h-[80%] w-[60%] rounded-full bg-[hsl(var(--cyan))] opacity-[0.03] blur-[120px]" />
            <div className="absolute -bottom-[30%] -left-[20%] h-[70%] w-[50%] rounded-full bg-[hsl(var(--magenta))] opacity-[0.03] blur-[120px]" />
          </div>
          {children}
        </Providers>
      </body>
    </html>
  );
}
