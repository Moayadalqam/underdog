// ===========================================
// Shared Constants
// ===========================================

export const APP_NAME = 'Underdog AI';

export const USER_ROLES = ['admin', 'trainer', 'trainee'] as const;

export const SESSION_TYPES = ['roleplay', 'recording_analysis'] as const;

export const CURRICULUM_MODULES_COUNT = 12;

export const VOICE_LATENCY_TARGET_MS = 200;

export const API_ROUTES = {
  // Stream 1: Core
  AUTH: '/api/auth',
  USERS: '/api/users',

  // Stream 2: Voice/AI
  ROLEPLAY: '/api/roleplay',
  VOICE: '/api/voice',

  // Stream 3: Curriculum
  CURRICULUM: '/api/curriculum',
  OBJECTIONS: '/api/objections',

  // Stream 4: Analytics
  ANALYTICS: '/api/analytics',
  FEEDBACK: '/api/feedback',

  // Stream 5: Recordings
  RECORDINGS: '/api/recordings',

  // Stream 6: Admin
  ADMIN: '/api/admin',
} as const;
