'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  ChevronRight,
  MessageSquare,
  Lightbulb,
  Target,
  BookOpen,
  Star,
  Tag,
  Layers,
  TrendingUp,
  CheckCircle2,
  Mic,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/navigation/navbar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glow-card';
import { FadeIn, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { cn } from '@/lib/utils';

interface Objection {
  id: string;
  text: string;
  category: string;
  difficulty: number;
  suggestedResponses: string[];
  isActive: boolean;
}

const categories = [
  { id: 'all', name: 'All Objections', icon: Layers },
  { id: 'common', name: 'Common Objections', icon: MessageSquare },
  { id: 'industry', name: 'Industry Specific', icon: Target },
  { id: 'personality', name: 'Personality Based', icon: Lightbulb },
];

export default function ObjectionsPage() {
  const [objections, setObjections] = useState<Objection[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedObjection, setExpandedObjection] = useState<string | null>(null);
  const [starredObjections, setStarredObjections] = useState<Set<string>>(new Set());

  useEffect(() => {
    async function fetchObjections() {
      try {
        const url = selectedCategory === 'all'
          ? '/api/objections'
          : `/api/objections?category=${selectedCategory}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setObjections(data);
        }
      } catch (error) {
        console.error('Failed to fetch objections:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchObjections();
  }, [selectedCategory]);

  const filteredObjections = objections.filter((obj) => {
    const matchesSearch = obj.text.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Easy';
    if (difficulty <= 3) return 'Medium';
    return 'Hard';
  };

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'text-green-500 bg-green-500/10';
    if (difficulty <= 3) return 'text-yellow-500 bg-yellow-500/10';
    return 'text-red-500 bg-red-500/10';
  };

  const toggleStar = (id: string) => {
    setStarredObjections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const totalResponses = objections.reduce(
    (acc, obj) => acc + obj.suggestedResponses.length,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen pb-20">
        <Navbar />
        <main className="pt-28 px-4 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading objections...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Navbar />

      <main className="pt-28 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <FadeIn className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold">
              Objection <span className="gradient-text">Library</span>
            </h1>
            <p className="mt-2 text-lg text-muted-foreground">
              Master common objections with proven response techniques
            </p>
          </FadeIn>

          {/* Stats */}
          <FadeIn delay={0.1} className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <GlassCard className="p-4 text-center">
                <div className="text-3xl font-bold gradient-text">{objections.length}</div>
                <div className="text-sm text-muted-foreground">Total Objections</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-3xl font-bold text-cyan">{totalResponses}</div>
                <div className="text-sm text-muted-foreground">Response Scripts</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-3xl font-bold text-green-500">{categories.length - 1}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </GlassCard>
              <GlassCard className="p-4 text-center">
                <div className="text-3xl font-bold text-magenta">{starredObjections.size}</div>
                <div className="text-sm text-muted-foreground">Starred</div>
              </GlassCard>
            </div>
          </FadeIn>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Sidebar - Categories */}
            <div className="lg:col-span-1">
              <FadeIn delay={0.2}>
                <GlassCard className="p-4 sticky top-28">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Filter size={18} />
                    Categories
                  </h3>
                  <div className="space-y-1">
                    {categories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={cn(
                            'w-full flex items-center justify-between p-2 rounded-lg transition-colors text-left',
                            selectedCategory === category.id
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-muted text-muted-foreground'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            <span className="text-sm">{category.name}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Practice CTA */}
                  <div className="border-t border-border mt-4 pt-4">
                    <Link href="/roleplay">
                      <Button variant="gradient" size="sm" className="w-full">
                        <Mic size={14} className="mr-2" />
                        Practice Now
                      </Button>
                    </Link>
                  </div>
                </GlassCard>
              </FadeIn>
            </div>

            {/* Main Content - Objections List */}
            <div className="lg:col-span-3">
              {/* Search */}
              <FadeIn delay={0.3} className="mb-6">
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <input
                    type="text"
                    placeholder="Search objections..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-card border border-border focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
                  />
                </div>
              </FadeIn>

              {/* Objections */}
              <StaggerContainer className="space-y-4" staggerDelay={0.05}>
                {filteredObjections.map((obj) => (
                  <StaggerItem key={obj.id}>
                    <GlassCard className="overflow-hidden">
                      <div
                        onClick={() => setExpandedObjection(expandedObjection === obj.id ? null : obj.id)}
                        className="w-full p-4 text-left cursor-pointer hover:bg-muted/30 transition-colors"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setExpandedObjection(expandedObjection === obj.id ? null : obj.id);
                          }
                        }}
                      >
                        <div className="flex items-start gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleStar(obj.id);
                            }}
                            className={cn(
                              'mt-1 transition-colors',
                              starredObjections.has(obj.id) ? 'text-yellow-500' : 'text-muted-foreground hover:text-yellow-500'
                            )}
                          >
                            <Star size={18} className={starredObjections.has(obj.id) ? 'fill-current' : ''} />
                          </button>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="text-lg font-semibold">"{obj.text}"</h3>
                              <span className={cn(
                                'px-2 py-0.5 rounded-full text-xs font-medium',
                                getDifficultyColor(obj.difficulty)
                              )}>
                                {getDifficultyLabel(obj.difficulty)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1 capitalize">
                                <Tag size={12} />
                                {obj.category}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageSquare size={12} />
                                {obj.suggestedResponses.length} responses
                              </span>
                            </div>
                          </div>

                          <motion.div
                            animate={{ rotate: expandedObjection === obj.id ? 90 : 0 }}
                          >
                            <ChevronRight size={20} className="text-muted-foreground" />
                          </motion.div>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedObjection === obj.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 border-t border-border pt-4">
                              {/* Response Scripts */}
                              <h4 className="font-semibold mb-3 flex items-center gap-2">
                                <MessageSquare size={16} />
                                Suggested Responses
                              </h4>
                              <div className="space-y-3 mb-6">
                                {obj.suggestedResponses.map((response, idx) => (
                                  <div
                                    key={idx}
                                    className="p-3 rounded-xl bg-muted/50"
                                  >
                                    <p className="text-sm italic">"{response}"</p>
                                  </div>
                                ))}
                              </div>

                              {/* Related Module */}
                              <div className="flex items-center justify-between p-3 rounded-xl bg-primary/5 border border-primary/20">
                                <div className="flex items-center gap-2">
                                  <BookOpen size={16} className="text-primary" />
                                  <span className="text-sm">
                                    Practice this objection with AI role-play
                                  </span>
                                </div>
                                <Link href="/roleplay">
                                  <Button variant="ghost" size="sm">
                                    Start Practice
                                    <ChevronRight size={14} className="ml-1" />
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </GlassCard>
                  </StaggerItem>
                ))}
              </StaggerContainer>

              {filteredObjections.length === 0 && (
                <FadeIn>
                  <div className="text-center py-12">
                    <Search size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                      No objections found matching your criteria.
                    </p>
                  </div>
                </FadeIn>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
