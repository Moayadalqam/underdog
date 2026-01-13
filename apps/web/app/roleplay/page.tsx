'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  RotateCcw,
  Settings,
  ChevronRight,
  User,
  Building2,
  Briefcase,
  Clock,
  MessageSquare,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button, MotionButton } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { VoiceOrb, VoiceWave } from '@/components/ui/voice-wave';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

type SessionState = 'idle' | 'connecting' | 'active' | 'ended';

const scenarios = [
  {
    id: 'quick',
    title: 'Quick Practice',
    description: 'Jump into a random scenario with an AI prospect',
    icon: Mic,
    color: 'cyan' as const,
  },
  {
    id: 'module',
    title: 'Module-Based',
    description: 'Practice scenarios from your curriculum progress',
    icon: Briefcase,
    color: 'magenta' as const,
  },
  {
    id: 'custom',
    title: 'Custom Scenario',
    description: 'Create your own practice with specific objections',
    icon: Settings,
    color: 'cyan' as const,
  },
];

const personas = [
  { id: 'skeptical', name: 'Skeptical Steve', difficulty: 'Hard', traits: ['Price-focused', 'Needs proof'] },
  { id: 'busy', name: 'Busy Barbara', difficulty: 'Medium', traits: ['No time', 'Direct'] },
  { id: 'friendly', name: 'Friendly Frank', difficulty: 'Easy', traits: ['Open', 'Curious'] },
  { id: 'gatekeeper', name: 'Gatekeeper Gary', difficulty: 'Hard', traits: ['Protective', 'Dismissive'] },
];

export default function RolePlayPage() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState(personas[0]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);

  const startSession = () => {
    setSessionState('connecting');
    // Simulate connection
    setTimeout(() => {
      setSessionState('active');
    }, 2000);
  };

  const endSession = () => {
    setSessionState('ended');
    setTimeout(() => {
      setSessionState('idle');
      setSelectedScenario(null);
    }, 3000);
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">
              AI <span className="gradient-text">Role-Play</span> Training
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Practice your cold calling skills with AI-powered prospects
            </p>
          </FadeIn>

          <AnimatePresence mode="wait">
            {sessionState === 'idle' && !selectedScenario && (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Scenario Selection */}
                <StaggerContainer className="grid gap-6 md:grid-cols-3 mb-12">
                  {scenarios.map((scenario) => (
                    <StaggerItem key={scenario.id}>
                      <GlowCard
                        glowColor={scenario.color}
                        className="cursor-pointer"
                        onClick={() => setSelectedScenario(scenario.id)}
                      >
                        <div className="flex flex-col h-full">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex items-center justify-center mb-4',
                              scenario.color === 'cyan'
                                ? 'bg-cyan/10 text-cyan'
                                : 'bg-magenta/10 text-magenta'
                            )}
                          >
                            <scenario.icon size={28} />
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{scenario.title}</h3>
                          <p className="text-muted-foreground mb-4">{scenario.description}</p>
                          <div className="mt-auto flex items-center text-primary text-sm font-medium">
                            Start <ChevronRight size={16} className="ml-1" />
                          </div>
                        </div>
                      </GlowCard>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                {/* Recent Sessions */}
                <FadeIn delay={0.3}>
                  <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
                  <GlassCard className="p-6">
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No recent sessions yet. Start your first practice above!</p>
                    </div>
                  </GlassCard>
                </FadeIn>
              </motion.div>
            )}

            {sessionState === 'idle' && selectedScenario && (
              <motion.div
                key="persona-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Persona Selection */}
                <div className="mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => setSelectedScenario(null)}
                    className="mb-4"
                  >
                    ← Back to scenarios
                  </Button>
                  <h2 className="text-2xl font-semibold">Choose Your AI Prospect</h2>
                  <p className="text-muted-foreground">
                    Select a persona to practice with
                  </p>
                </div>

                <StaggerContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                  {personas.map((persona) => (
                    <StaggerItem key={persona.id}>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedPersona(persona)}
                        className={cn(
                          'p-4 rounded-xl border-2 cursor-pointer transition-colors',
                          selectedPersona.id === persona.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                            <User size={24} className="text-white" />
                          </div>
                          <div>
                            <p className="font-semibold">{persona.name}</p>
                            <p
                              className={cn(
                                'text-xs font-medium',
                                persona.difficulty === 'Easy' && 'text-green-500',
                                persona.difficulty === 'Medium' && 'text-yellow-500',
                                persona.difficulty === 'Hard' && 'text-red-500'
                              )}
                            >
                              {persona.difficulty}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {persona.traits.map((trait) => (
                            <span
                              key={trait}
                              className="px-2 py-0.5 text-xs rounded-full bg-muted text-muted-foreground"
                            >
                              {trait}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>

                <div className="flex justify-center">
                  <MotionButton variant="gradient" size="xl" onClick={startSession}>
                    <Phone size={20} className="mr-2" />
                    Start Call with {selectedPersona.name}
                  </MotionButton>
                </div>
              </motion.div>
            )}

            {(sessionState === 'connecting' || sessionState === 'active' || sessionState === 'ended') && (
              <motion.div
                key="session"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="max-w-3xl mx-auto"
              >
                {/* Active Session Interface */}
                <GlassCard className="p-8">
                  {/* Prospect Info */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan to-magenta flex items-center justify-center">
                        <User size={32} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-lg">{selectedPersona.name}</p>
                        <p className="text-muted-foreground text-sm flex items-center gap-2">
                          <Building2 size={14} />
                          Acme Corporation
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          sessionState === 'connecting' && 'text-yellow-500',
                          sessionState === 'active' && 'text-green-500',
                          sessionState === 'ended' && 'text-red-500'
                        )}
                      >
                        {sessionState === 'connecting' && 'Connecting...'}
                        {sessionState === 'active' && 'Call Active'}
                        {sessionState === 'ended' && 'Call Ended'}
                      </p>
                      {sessionState === 'active' && (
                        <p className="text-2xl font-mono text-muted-foreground">
                          {Math.floor(callDuration / 60)}:{(callDuration % 60).toString().padStart(2, '0')}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Voice Orb */}
                  <div className="flex flex-col items-center py-12">
                    <VoiceOrb
                      isActive={sessionState === 'active'}
                      size="lg"
                    />
                    <VoiceWave
                      isActive={sessionState === 'active'}
                      barCount={9}
                      color="gradient"
                      className="mt-8 h-16"
                    />
                    <p className="mt-4 text-muted-foreground">
                      {sessionState === 'connecting' && 'Connecting to AI prospect...'}
                      {sessionState === 'active' && 'AI is listening...'}
                      {sessionState === 'ended' && 'Session complete!'}
                    </p>
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-center gap-4 pt-8 border-t border-border">
                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full"
                      onClick={() => setIsMuted(!isMuted)}
                    >
                      {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
                    </Button>

                    {sessionState === 'active' ? (
                      <Button
                        variant="destructive"
                        size="icon"
                        className="w-16 h-16 rounded-full"
                        onClick={endSession}
                      >
                        <PhoneOff size={28} />
                      </Button>
                    ) : sessionState === 'ended' ? (
                      <Button
                        variant="gradient"
                        size="icon"
                        className="w-16 h-16 rounded-full"
                        onClick={() => {
                          setSessionState('idle');
                          setSelectedScenario(null);
                        }}
                      >
                        <RotateCcw size={28} />
                      </Button>
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-muted animate-pulse" />
                    )}

                    <Button
                      variant="outline"
                      size="icon"
                      className="w-14 h-14 rounded-full"
                      onClick={() => setIsSpeakerOn(!isSpeakerOn)}
                    >
                      {isSpeakerOn ? <Volume2 size={24} /> : <VolumeX size={24} />}
                    </Button>
                  </div>

                  {/* Live Transcript Preview */}
                  {sessionState === 'active' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-8 p-4 rounded-xl bg-muted/50"
                    >
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <MessageSquare size={14} />
                        Live Transcript
                      </div>
                      <p className="text-sm">
                        <span className="text-cyan font-medium">AI: </span>
                        "Hi, this is Steve from Acme. I'm actually in the middle of something, what's this about?"
                      </p>
                    </motion.div>
                  )}
                </GlassCard>

                {/* Tips Panel */}
                {sessionState === 'active' && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6"
                  >
                    <GlassCard className="p-4">
                      <p className="text-sm font-medium text-primary mb-2">💡 Real-time Tip</p>
                      <p className="text-sm text-muted-foreground">
                        The prospect seems busy. Try acknowledging their time constraint before presenting your value proposition.
                      </p>
                    </GlassCard>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
