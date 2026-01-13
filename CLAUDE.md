# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Underdog is an AI-powered sales training platform for cold calling practice. The system provides:

- **AI Role-Play Agent**: Voice-enabled AI that simulates prospects for sales training
- **Objection Handling**: Custom library based on client's proprietary frameworks
- **Curriculum Integration**: 12-module cold calling training program
- **Pitch Analysis**: Real-time feedback and improvement suggestions
- **Call Recording Analysis**: Upload and analyze actual sales calls

## Project Status

This project is in **Phase 1 - Discovery & Architecture**. No code has been implemented yet.

### Phase 1 Deliverables
- Requirements gathering and use case documentation
- Conversation flow design for role-play scenarios
- Objection handling framework integration planning
- Technology stack selection and architecture planning
- Detailed Specifications Document

### Phase 1 Workflow
Use BMAD workflows for planning artifacts:
- `/bmad:bmm:workflows:create-prd` - Create the Product Requirements Document
- `/bmad:bmm:workflows:create-architecture` - Design system architecture
- `/bmad:bmm:workflows:research` - Conduct technical/market research

## Key Documents

- `mvp.md` - Project phases and milestone overview
- `_bmad-output/planning-artifacts/prd.md` - Product Requirements Document (in progress)

## Project Structure

```
underdog/
├── CLAUDE.md                    # This file
├── mvp.md                       # Phase/milestone definitions
├── docs/                        # Documentation (empty until implementation)
└── _bmad-output/
    └── planning-artifacts/      # BMAD workflow outputs
        └── prd.md               # PRD (template started)
```

## Architecture Notes

*To be updated once implementation begins. Key technical areas:*
- Voice synthesis (TTS) and recognition (STT) integration
- AI agent training pipeline for sales methodology
- Analytics and monitoring dashboard
- Call recording processing pipeline

## Build Commands

*To be added once tech stack is selected.*
