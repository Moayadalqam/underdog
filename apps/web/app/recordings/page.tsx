'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileAudio,
  Play,
  Pause,
  Clock,
  Calendar,
  MessageSquare,
  Star,
  MoreVertical,
  Download,
  Trash2,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Navbar } from '@/components/navigation/navbar';
import { Button, MotionButton } from '@/components/ui/button';
import { GlowCard, GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

const mockRecordings = [
  {
    id: '1',
    name: 'Sales Call - Acme Corp',
    duration: '12:34',
    date: '2024-01-12',
    score: 85,
    status: 'analyzed' as const,
    transcript: true,
  },
  {
    id: '2',
    name: 'Discovery Call - TechStart',
    duration: '8:22',
    date: '2024-01-11',
    score: 78,
    status: 'analyzed' as const,
    transcript: true,
  },
  {
    id: '3',
    name: 'Follow-up - Beta Inc',
    duration: '5:45',
    date: '2024-01-10',
    score: null,
    status: 'processing' as const,
    transcript: false,
  },
  {
    id: '4',
    name: 'Cold Call Practice',
    duration: '15:20',
    date: '2024-01-09',
    score: 72,
    status: 'analyzed' as const,
    transcript: true,
  },
];

export default function RecordingsPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files[0]);
    }
  }, []);

  const handleUpload = (file: File) => {
    setIsUploading(true);
    // Simulate upload
    setTimeout(() => {
      setIsUploading(false);
    }, 3000);
  };

  const filteredRecordings = mockRecordings.filter((r) =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                Call <span className="gradient-text">Recordings</span>
              </h1>
              <p className="mt-2 text-lg text-muted-foreground">
                Upload and analyze your sales calls
              </p>
            </div>
            <MotionButton variant="gradient">
              <Upload size={18} className="mr-2" />
              Upload Recording
            </MotionButton>
          </FadeIn>

          {/* Upload Area */}
          <FadeIn delay={0.1} className="mb-8">
            <motion.div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              animate={{
                scale: isDragging ? 1.02 : 1,
                borderColor: isDragging ? 'hsl(var(--primary))' : 'hsl(var(--border))',
              }}
              className={cn(
                'relative rounded-2xl border-2 border-dashed p-12 text-center transition-colors',
                isDragging ? 'bg-primary/5 border-primary' : 'bg-card/50 border-border'
              )}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 size={48} className="text-primary animate-spin mb-4" />
                  <h3 className="text-lg font-semibold">Uploading...</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Processing your recording
                  </p>
                  <div className="w-64 h-2 rounded-full bg-muted mt-4 overflow-hidden">
                    <motion.div
                      initial={{ width: '0%' }}
                      animate={{ width: '70%' }}
                      transition={{ duration: 2 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan to-magenta"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <motion.div
                    animate={{ y: isDragging ? -10 : 0 }}
                    className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 mb-6"
                  >
                    <Upload size={36} className="text-primary" />
                  </motion.div>
                  <h3 className="text-xl font-semibold">
                    {isDragging ? 'Drop your file here' : 'Upload a call recording'}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    Drag and drop an audio file or click to browse
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Supported: MP3, WAV, M4A, WEBM (max 100MB)
                  </p>
                  <Button variant="outline" size="lg" className="mt-6">
                    <FileAudio size={18} className="mr-2" />
                    Choose File
                  </Button>
                </>
              )}
            </motion.div>
          </FadeIn>

          {/* Search and Filter */}
          <FadeIn delay={0.2} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Search recordings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter size={16} />
                Filter
              </Button>
            </div>
          </FadeIn>

          {/* Recordings List */}
          <FadeIn delay={0.3}>
            <GlassCard className="overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold">Your Recordings</h3>
                <span className="text-sm text-muted-foreground">
                  {filteredRecordings.length} recordings
                </span>
              </div>

              {filteredRecordings.length === 0 ? (
                <div className="p-12 text-center">
                  <FileAudio size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                  <p className="text-muted-foreground">
                    No recordings yet. Upload a call to get AI-powered feedback!
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredRecordings.map((recording, index) => (
                    <motion.div
                      key={recording.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      className="p-4 hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        {/* Play button */}
                        <button
                          onClick={() =>
                            setPlayingId(playingId === recording.id ? null : recording.id)
                          }
                          className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center transition-colors',
                            playingId === recording.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted hover:bg-primary/20 text-foreground'
                          )}
                        >
                          {playingId === recording.id ? (
                            <Pause size={20} />
                          ) : (
                            <Play size={20} className="ml-0.5" />
                          )}
                        </button>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium truncate">{recording.name}</h4>
                            {recording.status === 'processing' && (
                              <span className="flex items-center gap-1 text-xs text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded-full">
                                <Loader2 size={10} className="animate-spin" />
                                Processing
                              </span>
                            )}
                            {recording.status === 'analyzed' && (
                              <span className="flex items-center gap-1 text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                                <CheckCircle2 size={10} />
                                Analyzed
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock size={12} />
                              {recording.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              {recording.date}
                            </span>
                            {recording.transcript && (
                              <span className="flex items-center gap-1">
                                <MessageSquare size={12} />
                                Transcript
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Score */}
                        {recording.score !== null && (
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex flex-col items-center justify-center',
                              recording.score >= 80
                                ? 'bg-green-500/10 text-green-500'
                                : recording.score >= 70
                                ? 'bg-cyan/10 text-cyan'
                                : 'bg-orange-500/10 text-orange-500'
                            )}
                          >
                            <Star size={14} />
                            <span className="text-sm font-bold">{recording.score}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="hidden sm:flex">
                            View Analysis
                            <ChevronRight size={16} className="ml-1" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <MoreVertical size={18} />
                          </Button>
                        </div>
                      </div>

                      {/* Audio waveform visualization */}
                      <AnimatePresence>
                        {playingId === recording.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="mt-4 overflow-hidden"
                          >
                            <div className="bg-muted/50 rounded-xl p-4">
                              {/* Fake waveform */}
                              <div className="flex items-center justify-center gap-0.5 h-16">
                                {Array.from({ length: 60 }).map((_, i) => (
                                  <motion.div
                                    key={i}
                                    initial={{ height: '20%' }}
                                    animate={{
                                      height: `${20 + Math.random() * 80}%`,
                                    }}
                                    transition={{
                                      duration: 0.5,
                                      repeat: Infinity,
                                      repeatType: 'reverse',
                                      delay: i * 0.02,
                                    }}
                                    className="w-1 rounded-full bg-gradient-to-t from-cyan to-magenta"
                                  />
                                ))}
                              </div>
                              <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
                                <span>0:00</span>
                                <span>{recording.duration}</span>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              )}
            </GlassCard>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}
