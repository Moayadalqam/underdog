'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Mic,
  BookOpen,
  BarChart3,
  FileAudio,
  Target,
  Zap,
  ArrowRight,
  Play,
  Users,
  TrendingUp,
  Award,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { MotionButton } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { VoiceOrb, VoiceWave } from '@/components/ui/voice-wave';
import { FadeIn, StaggerContainer, StaggerItem, BlurFadeText } from '@/components/ui/motion';

const features = [
  {
    title: 'AI Role-Play',
    description: 'Practice cold calls with AI prospects that simulate real objections and buyer personalities.',
    icon: Mic,
    href: '/roleplay',
    color: 'cyan' as const,
  },
  {
    title: '12-Module Curriculum',
    description: 'Structured training program covering every aspect of cold calling mastery.',
    icon: BookOpen,
    href: '/curriculum',
    color: 'magenta' as const,
  },
  {
    title: 'Performance Analytics',
    description: 'Track your progress with detailed metrics and identify areas for improvement.',
    icon: BarChart3,
    href: '/analytics',
    color: 'cyan' as const,
  },
  {
    title: 'Call Recording Analysis',
    description: 'Upload real calls for AI-powered feedback, scoring, and actionable insights.',
    icon: FileAudio,
    href: '/recordings',
    color: 'magenta' as const,
  },
  {
    title: 'Objection Mastery',
    description: 'Master common objections with proven response frameworks and real-time suggestions.',
    icon: Target,
    href: '/curriculum',
    color: 'cyan' as const,
  },
  {
    title: 'Real-time Feedback',
    description: 'Get instant AI suggestions during practice to improve your pitch on the fly.',
    icon: Zap,
    href: '/roleplay',
    color: 'magenta' as const,
  },
];

const stats = [
  { value: '10,000+', label: 'Training Sessions', icon: Users },
  { value: '45%', label: 'Avg. Improvement', icon: TrendingUp },
  { value: '98%', label: 'User Satisfaction', icon: Award },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                  <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  AI-Powered Sales Training
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                  Master Cold Calling with{' '}
                  <BlurFadeText delay={0.3} className="gradient-text">
                    AI Role-Play
                  </BlurFadeText>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
                  Practice with AI prospects that challenge you with real objections.
                  Get instant feedback, track your progress, and become unstoppable.
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href="/roleplay">
                    <MotionButton variant="gradient" size="xl">
                      <Play size={20} className="mr-2" />
                      Start Training
                    </MotionButton>
                  </Link>
                  <Link href="/curriculum">
                    <MotionButton variant="outline" size="xl">
                      View Curriculum
                      <ArrowRight size={20} className="ml-2" />
                    </MotionButton>
                  </Link>
                </div>
              </FadeIn>
            </div>

            {/* Right: Voice Orb Animation */}
            <FadeIn delay={0.4} className="flex justify-center">
              <div className="relative">
                {/* Decorative rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-full border border-cyan/20 animate-pulse-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border border-magenta/10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                {/* Main orb */}
                <div className="relative z-10 flex flex-col items-center gap-8">
                  <VoiceOrb isActive size="lg" />
                  <VoiceWave isActive barCount={7} color="gradient" className="h-12" />
                  <p className="text-sm text-muted-foreground">AI Assistant Ready</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <StaggerItem key={stat.label}>
                <GlassCard className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                    <stat.icon size={24} />
                  </div>
                  <p className="text-4xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-muted-foreground mt-1">{stat.label}</p>
                </GlassCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need to{' '}
              <span className="gradient-text">Close More Deals</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete training platform designed to transform your cold calling skills
            </p>
          </FadeIn>

          <StaggerContainer
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            staggerDelay={0.1}
          >
            {features.map((feature) => (
              <StaggerItem key={feature.title}>
                <Link href={feature.href}>
                  <GlowCard glowColor={feature.color} className="h-full">
                    <div className="flex flex-col h-full">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                          feature.color === 'cyan'
                            ? 'bg-cyan/10 text-cyan'
                            : 'bg-magenta/10 text-magenta'
                        }`}
                      >
                        <feature.icon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground flex-grow">{feature.description}</p>
                      <div className="mt-4 flex items-center text-primary text-sm font-medium group-hover:gap-2 transition-all">
                        Learn more <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </GlowCard>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan/20 via-magenta/20 to-cyan/20" />
              <div className="absolute inset-0 backdrop-blur-3xl" />

              <div className="relative px-8 py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                  Ready to Transform Your Sales Skills?
                </h2>
                <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
                  Start practicing with AI role-play and see your close rate improve in weeks.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/roleplay">
                    <MotionButton variant="gradient" size="xl">
                      <Mic size={20} className="mr-2" />
                      Start Free Practice
                    </MotionButton>
                  </Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
              <span className="text-white font-bold text-sm">U</span>
            </div>
            <span className="font-semibold">Underdog AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Underdog AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
