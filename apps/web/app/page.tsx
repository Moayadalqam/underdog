'use client';

import Link from 'next/link';
import Image from 'next/image';
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
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { MotionButton } from '@/components/ui/button';
import { VoiceOrb, VoiceWave } from '@/components/ui/voice-wave';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';

const features = [
  {
    title: 'AI Role-Play',
    description: 'Practice cold calls with AI prospects that simulate real objections and buyer personalities.',
    icon: Mic,
    href: '/roleplay',
  },
  {
    title: '12-Module Curriculum',
    description: 'Structured training program covering every aspect of cold calling mastery.',
    icon: BookOpen,
    href: '/curriculum',
  },
  {
    title: 'Performance Analytics',
    description: 'Track your progress with detailed metrics and identify areas for improvement.',
    icon: BarChart3,
    href: '/analytics',
  },
  {
    title: 'Call Recording Analysis',
    description: 'Upload real calls for AI-powered feedback, scoring, and actionable insights.',
    icon: FileAudio,
    href: '/recordings',
  },
  {
    title: 'Objection Mastery',
    description: 'Master common objections with proven response frameworks and real-time suggestions.',
    icon: Target,
    href: '/curriculum',
  },
  {
    title: 'Real-time Feedback',
    description: 'Get instant AI suggestions during practice to improve your pitch on the fly.',
    icon: Zap,
    href: '/roleplay',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <div className="text-center lg:text-left">
              <FadeIn>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e6b123]/10 text-[#e6b123] text-sm font-medium mb-6 border border-[#e6b123]/20">
                  <span className="w-2 h-2 rounded-full bg-[#e6b123] animate-pulse" />
                  AI-Powered Sales Training
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#05193a]">
                  Master Cold Calling with{' '}
                  <span className="text-[#e6b123]">AI Role-Play</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p className="mt-6 text-lg text-[#05193a]/70 max-w-xl mx-auto lg:mx-0">
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
                  <div className="w-64 h-64 rounded-full border border-[#e6b123]/20 animate-pulse-slow" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-80 h-80 rounded-full border border-[#05193a]/10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
                </div>

                {/* Main orb */}
                <div className="relative z-10 flex flex-col items-center gap-8">
                  <VoiceOrb isActive size="lg" />
                  <VoiceWave isActive barCount={7} color="gradient" className="h-12" />
                  <p className="text-sm text-[#05193a]/60">AI Assistant Ready</p>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#05193a]">
              Everything You Need to{' '}
              <span className="text-[#e6b123]">Close More Deals</span>
            </h2>
            <p className="mt-4 text-lg text-[#05193a]/70 max-w-2xl mx-auto">
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
                  <div className="h-full p-6 rounded-2xl bg-white border border-[#05193a]/10 hover:border-[#e6b123]/50 hover:shadow-lg hover:shadow-[#e6b123]/10 transition-all duration-300 group">
                    <div className="flex flex-col h-full">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 bg-[#e6b123]/10 text-[#e6b123]">
                        <feature.icon size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-[#05193a]">{feature.title}</h3>
                      <p className="text-[#05193a]/60 flex-grow">{feature.description}</p>
                      <div className="mt-4 flex items-center text-[#e6b123] text-sm font-medium group-hover:gap-2 transition-all">
                        Learn more <ArrowRight size={16} className="ml-1" />
                      </div>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden border border-[#05193a]/10">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#e6b123]/5 via-[#05193a]/5 to-[#e6b123]/5" />

              <div className="relative px-8 py-16 text-center">
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-[#05193a]">
                  Ready to Transform Your Sales Skills?
                </h2>
                <p className="text-lg text-[#05193a]/70 mb-8 max-w-xl mx-auto">
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
      <footer className="py-8 px-4 border-t border-[#05193a]/10 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.jpg" alt="Underdog" width={32} height={32} className="rounded-lg" />
            <span className="font-semibold text-[#05193a]">Underdog AI</span>
          </div>
          <p className="text-sm text-[#05193a]/60">
            © {new Date().getFullYear()} Underdog AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
