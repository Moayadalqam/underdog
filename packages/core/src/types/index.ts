// ===========================================
// Shared Type Definitions
// ===========================================
// These types define the contract between all streams.
// Changes require approval from all streams.

// ----- User & Auth (Stream 1) -----
export type UserRole = 'admin' | 'trainer' | 'trainee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

// ----- Training Session (Streams 2, 4, 5) -----
export type SessionType = 'roleplay' | 'recording_analysis';
export type SessionStatus = 'active' | 'completed' | 'abandoned';

export interface TrainingSession {
  id: string;
  userId: string;
  type: SessionType;
  moduleId?: string;
  scenarioId?: string;
  startedAt: Date;
  endedAt?: Date;
  status: SessionStatus;
}

// ----- Transcript (Streams 2, 4, 5) -----
export type Speaker = 'trainee' | 'ai' | 'prospect';

export interface TranscriptSegment {
  speaker: Speaker;
  text: string;
  startTime: number;
  endTime: number;
  confidence: number;
}

export interface Transcript {
  id: string;
  sessionId: string;
  segments: TranscriptSegment[];
  duration: number;
  createdAt: Date;
}

// ----- Curriculum (Stream 3) -----
export interface CurriculumModule {
  id: string;
  number: number; // 1-12
  title: string;
  description: string;
  lessons: Lesson[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  content: string;
  order: number;
}

export interface UserProgress {
  id: string;
  userId: string;
  moduleId: string;
  lessonId?: string;
  completedAt?: Date;
  score?: number;
}

// ----- Objections (Stream 3) -----
export type ObjectionCategory = 'common' | 'industry' | 'personality';

export interface Objection {
  id: string;
  category: ObjectionCategory;
  text: string;
  suggestedResponses: string[];
  difficulty: number; // 1-5
}

// ----- Analytics (Stream 4) -----
export interface SessionScores {
  sessionId: string;
  overallScore: number;
  categories: {
    opening: number;
    discovery: number;
    objectionHandling: number;
    closing: number;
  };
  feedback: string[];
  generatedAt: Date;
}

// ----- Recordings (Stream 5) -----
export type RecordingStatus = 'uploading' | 'processing' | 'transcribed' | 'analyzed' | 'failed';

export interface Recording {
  id: string;
  userId: string;
  filename: string;
  storageUrl: string;
  duration: number;
  status: RecordingStatus;
  transcriptId?: string;
  uploadedAt: Date;
}

// ----- AI Personas (Stream 2) -----
export type PersonalityType = 'skeptical' | 'busy' | 'interested' | 'hostile' | 'friendly';
export type MoodLevel = 'low' | 'medium' | 'high';

export interface AIPersona {
  id: string;
  name: string;
  personality: PersonalityType;
  moodRange: { min: MoodLevel; max: MoodLevel };
  objectionStyle: ObjectionCategory;
  responsePatterns: string[];
}
