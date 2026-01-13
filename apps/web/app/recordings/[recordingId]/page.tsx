'use client';

import { useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Download,
  Share2,
  Trash2,
  Clock,
  Calendar,
  Star,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Lightbulb,
  Target,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glow-card';
import { FadeIn } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

// Mock data for a recording
const mockRecording = {
  id: '1',
  name: 'Sales Call - Acme Corp',
  duration: '12:34',
  date: 'January 12, 2024',
  score: 85,
  status: 'analyzed',
  audioUrl: '/mock-audio.mp3',
  transcript: [
    { time: '0:00', speaker: 'You', text: "Hi, this is John from Underdog Sales. Is this Sarah?" },
    { time: '0:05', speaker: 'Prospect', text: "Yes, this is Sarah. How can I help you?" },
    { time: '0:10', speaker: 'You', text: "Great! I'm reaching out because I noticed your company has been expanding rapidly, and I wanted to share how we've helped similar companies streamline their sales process." },
    { time: '0:25', speaker: 'Prospect', text: "I appreciate the call, but we're actually pretty happy with our current setup." },
    { time: '0:32', speaker: 'You', text: "I completely understand. May I ask what's working well for you currently? I'm curious because many of our clients said the same thing before they discovered some gaps they weren't aware of." },
    { time: '0:45', speaker: 'Prospect', text: "Well, our team uses a combination of spreadsheets and our CRM, and it works okay for us." },
    { time: '0:55', speaker: 'You', text: "That's interesting. How much time would you say your team spends each week on manual data entry between those systems?" },
    { time: '1:05', speaker: 'Prospect', text: "Hmm, probably a few hours each week per person. It is a bit tedious." },
    { time: '1:15', speaker: 'You', text: "That's actually very common. What if I told you we could automate that entirely and give those hours back to actual selling? Would that be worth a 15-minute conversation?" },
    { time: '1:30', speaker: 'Prospect', text: "Actually, that does sound interesting. What does that look like?" },
    { time: '1:38', speaker: 'You', text: "Perfect! Let me walk you through a quick overview..." },
  ],
  analysis: {
    strengths: [
      'Strong opening with research-backed personalization',
      'Excellent handling of initial objection',
      'Good use of discovery questions',
      'Successfully pivoted to value proposition',
    ],
    improvements: [
      'Could have asked more about specific pain points',
      'Consider slowing down delivery in the opening',
      'Missed opportunity to quantify the cost of manual work',
    ],
    metrics: {
      talkRatio: 62,
      questionsAsked: 4,
      objectionHandling: 90,
      closingEffectiveness: 85,
      paceScore: 78,
    },
  },
};

export default function RecordingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const recordingId = params.recordingId as string;

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTranscriptIndex, setActiveTranscriptIndex] = useState(0);

  const totalDuration = 754; // 12:34 in seconds

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    setCurrentTime(Math.floor(percent * totalDuration));
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <FadeIn>
            <Link
              href="/recordings"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeft size={18} />
              Back to Recordings
            </Link>
          </FadeIn>

          {/* Header */}
          <FadeIn className="mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold">{mockRecording.name}</h1>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {mockRecording.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {mockRecording.date}
                  </span>
                  <span className="flex items-center gap-1 text-green-500">
                    <CheckCircle2 size={14} />
                    Analyzed
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 size={16} className="mr-2" />
                  Share
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-500">
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Player and Transcript */}
            <div className="lg:col-span-2 space-y-6">
              {/* Audio Player */}
              <FadeIn delay={0.1}>
                <GlassCard className="p-6">
                  {/* Waveform */}
                  <div
                    onClick={handleSeek}
                    className="relative h-24 bg-muted/30 rounded-xl overflow-hidden cursor-pointer mb-4"
                  >
                    {/* Waveform bars */}
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5 px-2">
                      {Array.from({ length: 100 }).map((_, i) => {
                        const height = 20 + Math.sin(i * 0.3) * 30 + Math.random() * 30;
                        const isPlayed = (i / 100) * totalDuration <= currentTime;
                        return (
                          <div
                            key={i}
                            className={cn(
                              'w-1 rounded-full transition-colors',
                              isPlayed
                                ? 'bg-gradient-to-t from-cyan to-magenta'
                                : 'bg-muted-foreground/30'
                            )}
                            style={{ height: `${height}%` }}
                          />
                        );
                      })}
                    </div>
                    {/* Progress line */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-primary"
                      style={{ left: `${(currentTime / totalDuration) * 100}%` }}
                    />
                  </div>

                  {/* Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" onClick={() => setCurrentTime(Math.max(0, currentTime - 10))}>
                        <SkipBack size={20} />
                      </Button>
                      <Button
                        variant="gradient"
                        size="icon"
                        className="w-12 h-12"
                        onClick={() => setIsPlaying(!isPlaying)}
                      >
                        {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setCurrentTime(Math.min(totalDuration, currentTime + 10))}>
                        <SkipForward size={20} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono">
                        {formatTime(currentTime)} / {mockRecording.duration}
                      </span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setIsMuted(!isMuted)}
                        >
                          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                        </Button>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={isMuted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(parseFloat(e.target.value));
                            setIsMuted(false);
                          }}
                          className="w-20 accent-primary"
                        />
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </FadeIn>

              {/* Transcript */}
              <FadeIn delay={0.2}>
                <GlassCard className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <MessageSquare size={20} />
                      Transcript
                    </h2>
                    <Button variant="ghost" size="sm">
                      <Download size={14} className="mr-2" />
                      Export
                    </Button>
                  </div>

                  <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {mockRecording.transcript.map((entry, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-3 rounded-xl transition-colors cursor-pointer',
                          index === activeTranscriptIndex
                            ? 'bg-primary/10 border border-primary/20'
                            : 'hover:bg-muted/50'
                        )}
                        onClick={() => setActiveTranscriptIndex(index)}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xs text-muted-foreground font-mono mt-1">
                            {entry.time}
                          </span>
                          <div className="flex-1">
                            <span
                              className={cn(
                                'text-xs font-medium',
                                entry.speaker === 'You' ? 'text-cyan' : 'text-magenta'
                              )}
                            >
                              {entry.speaker}
                            </span>
                            <p className="text-sm mt-1">{entry.text}</p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassCard>
              </FadeIn>
            </div>

            {/* Analysis Sidebar */}
            <div className="space-y-6">
              {/* Score Card */}
              <FadeIn delay={0.3}>
                <GlassCard className="p-6 text-center">
                  <div className="relative w-28 h-28 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-muted/20"
                      />
                      <circle
                        cx="56"
                        cy="56"
                        r="48"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${mockRecording.score * 3.01} 301`}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--cyan)" />
                          <stop offset="100%" stopColor="var(--magenta)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div>
                        <Star size={16} className="mx-auto text-yellow-500 mb-1" />
                        <span className="text-3xl font-bold">{mockRecording.score}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold">Great Performance!</p>
                  <p className="text-sm text-muted-foreground">Above average for cold calls</p>
                </GlassCard>
              </FadeIn>

              {/* Metrics */}
              <FadeIn delay={0.4}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp size={18} />
                    Key Metrics
                  </h3>
                  <div className="space-y-4">
                    <MetricBar label="Talk Ratio" value={mockRecording.analysis.metrics.talkRatio} suffix="% you" />
                    <MetricBar label="Questions Asked" value={mockRecording.analysis.metrics.questionsAsked} max={10} />
                    <MetricBar label="Objection Handling" value={mockRecording.analysis.metrics.objectionHandling} />
                    <MetricBar label="Closing Effectiveness" value={mockRecording.analysis.metrics.closingEffectiveness} />
                    <MetricBar label="Pace Score" value={mockRecording.analysis.metrics.paceScore} />
                  </div>
                </GlassCard>
              </FadeIn>

              {/* Strengths */}
              <FadeIn delay={0.5}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-green-500">
                    <ThumbsUp size={18} />
                    Strengths
                  </h3>
                  <ul className="space-y-2">
                    {mockRecording.analysis.strengths.map((strength, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 size={14} className="text-green-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>

              {/* Improvements */}
              <FadeIn delay={0.6}>
                <GlassCard className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2 text-yellow-500">
                    <Lightbulb size={18} />
                    Areas to Improve
                  </h3>
                  <ul className="space-y-2">
                    {mockRecording.analysis.improvements.map((improvement, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <Target size={14} className="text-yellow-500 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{improvement}</span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              </FadeIn>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function MetricBar({
  label,
  value,
  max = 100,
  suffix,
}: {
  label: string;
  value: number;
  max?: number;
  suffix?: string;
}) {
  const percent = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">
          {value}{suffix ? ` ${suffix}` : max === 100 ? '%' : `/${max}`}
        </span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={cn(
            'h-full rounded-full',
            percent >= 80 ? 'bg-green-500' : percent >= 60 ? 'bg-cyan' : 'bg-yellow-500'
          )}
        />
      </div>
    </div>
  );
}
