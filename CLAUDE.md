# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Underdog is an AI-powered sales training platform for cold calling practice. Core features:
- **AI Role-Play Agent**: Voice-enabled AI simulating prospects for sales training
- **Objection Handling**: Library based on proprietary sales frameworks
- **Curriculum**: 12-module cold calling training program
- **Call Recording Analysis**: Upload and analyze actual sales calls

## Build Commands

```bash
# Development
pnpm dev                          # Start web app (port 3000)
pnpm --filter @underdog/admin-app dev  # Start admin app (port 3001)

# Build & Lint
pnpm build                        # Build all packages (via Turbo)
pnpm lint                         # Lint all packages
pnpm typecheck                    # Type-check all packages
pnpm format                       # Format with Prettier

# Testing
pnpm test                         # Run tests (Vitest)
pnpm test:integration             # Run integration tests

# Database (run from packages/database)
pnpm --filter @underdog/database db:generate  # Generate Prisma client
pnpm --filter @underdog/database db:push      # Push schema to DB
pnpm --filter @underdog/database db:migrate   # Run migrations
pnpm --filter @underdog/database db:seed      # Seed database
```

## Architecture

### Monorepo Structure (pnpm workspaces + Turbo)

```
apps/
├── web/          # Main Next.js 15 app (React 19, App Router)
└── admin/        # Admin dashboard (port 3001)

packages/         # 14 shared packages organized by domain
├── core/         # Shared types, utilities, constants
├── auth/         # Supabase authentication
├── database/     # Prisma ORM and models
├── voice/        # TTS (Chatterbox/ElevenLabs) and STT (Deepgram)
├── ai-engine/    # Claude/Anthropic LLM orchestration
├── conversation/ # Dialog management for role-play
├── curriculum/   # Training module content
├── objections/   # Objection handling library
├── scoring/      # Call performance scoring
├── feedback/     # Real-time feedback system
├── analytics/    # Performance metrics
├── recordings/   # Audio file handling
├── transcription/# Speech-to-text processing
└── admin/        # Admin dashboard components

content/          # JSON data for curriculum, personas, objections
```

### Key Patterns

**Authentication**: Supabase SSR with middleware-based session management. Protected routes (`/roleplay`, `/analytics`, `/curriculum`, `/recordings`, `/admin`, `/settings`) redirect to `/login` if unauthenticated. Auth routes redirect authenticated users to `/roleplay`.

**Package imports**: All `@underdog/*` packages are transpiled by Next.js. Use workspace imports:
```typescript
import { someUtil } from '@underdog/core';
```

**Database**: Prisma schema at `packages/database/prisma/schema.prisma`. Key models: User, Organization, TrainingSession, AIPersona, CurriculumModule, Objection.

**Voice pipeline**: `@underdog/voice` provides TTS (Chatterbox primary, ElevenLabs fallback) and STT (Deepgram streaming).

## Environment Setup

Copy `.env.example` to `.env.local`. Required variables:
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase auth
- `DATABASE_URL` - PostgreSQL connection
- `ANTHROPIC_API_KEY` - Claude API for AI features
- `DEEPGRAM_API_KEY` - Real-time speech-to-text
- Voice TTS: Either `HUGGINGFACE_API_KEY` (Chatterbox) or `ELEVENLABS_API_KEY`

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, Framer Motion
- **Backend**: Supabase (auth + storage), Prisma 5, PostgreSQL
- **AI/Voice**: Anthropic Claude, Deepgram STT, Chatterbox/ElevenLabs TTS
- **Tooling**: TypeScript 5.3 (strict), pnpm 9, Turbo 2, Vitest, ESLint 9
