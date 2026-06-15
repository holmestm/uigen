# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**UIGen** is an AI-powered React component generator that allows users to describe components in natural language and preview them in real-time. The app uses Claude (via the Anthropic API) to generate React code with live preview and code editing capabilities.

## Essential Commands

```bash
# Setup (run once)
npm run setup                    # Installs dependencies, generates Prisma client, runs migrations

# Development
npm run dev                      # Start dev server with Turbopack (http://localhost:3000)
npm run dev:daemon              # Start dev server in background, logs to logs.txt

# Build & Run
npm run build                   # Build for production
npm start                       # Start production server

# Testing & Linting
npm test                        # Run Vitest (watch mode by default)
npm run lint                    # Run ESLint/Next.js lint

# Database
npm run db:reset               # Reset SQLite database and re-run migrations (destructive)
```

**Single test run:** `npm test -- --run src/lib/__tests__/file-system.test.ts`

## Architecture Overview

### Key Layers

1. **API Layer** (`src/app/api/chat/route.ts`):
   - Handles incoming chat messages with streaming responses
   - Uses Anthropic Claude with prompt caching for efficiency
   - Exposes two tools to Claude: `str_replace_editor` and `file_manager`
   - Falls back to mock provider if `ANTHROPIC_API_KEY` is not set

2. **Virtual File System** (`src/lib/file-system.ts`):
   - In-memory representation of generated code files
   - No files written to disk; serialized to JSON for persistence
   - Supports nested directories and file operations
   - Reconstructed from Prisma on each chat interaction

3. **Data Persistence** (Prisma + SQLite):
   - **User**: Email/password for authentication
   - **Project**: Stores chat history (JSON stringified messages) and file system state (serialized FileNodes)
   - Projects can be anonymous (userId = null) or owned by authenticated users

4. **UI Components** (React 19 + Tailwind CSS v4):
   - `/src/components/ui/`: Radix UI-based design system primitives
   - `/src/components/chat/`: Chat interface (MessageList, MessageInput, ChatInterface)
   - `/src/components/editor/`: Code editor (FileTree, CodeEditor with Monaco)
   - `/src/components/preview/`: Preview frame (renders generated components in an iframe)
   - `/src/components/auth/`: Sign in/up forms and auth dialog

5. **Server Actions** (`src/actions/index.ts`):
   - `createProject()`: Create a new project (authenticated or anonymous)
   - `getProject()`: Fetch project with messages and files
   - `getProjects()`: List user's projects
   - All marked with `'use server'` directive

### Important Details

- **Prompt System** (`src/lib/prompts/generation.tsx`):
  - System prompt with detailed instructions for Claude
  - Includes best practices for React, Tailwind CSS, and component design
  - Uses Anthropic prompt caching (ephemeral) to optimize costs

- **Auth** (`src/lib/auth.ts`):
  - JWT-based session management
  - Optional authentication — users can interact as anonymous
  - Fallback middleware for route protection

- **JSX Transformer** (`src/lib/transform/jsx-transformer.ts`):
  - Transforms JSX strings to executable React components in the preview
  - Used to render components in the virtual preview frame

- **Tool Definitions**:
  - `str_replace_editor`: Allows Claude to replace text in files (precise edits)
  - `file_manager`: Allows Claude to create/delete/list files in the virtual filesystem

## Testing Strategy

- **Framework**: Vitest + React Testing Library
- **Test Location**: `__tests__` directories alongside source files
- **Coverage Areas**:
  - `src/lib/__tests__/`: File system and utility logic
  - `src/lib/contexts/__tests__/`: Context and state management
  - `src/lib/transform/__tests__/`: JSX transformation
  - `src/components/chat/__tests__/`: Component rendering and interactions

Run tests with `npm test`. Add `-- --run` for single run without watch mode.

## Configuration Notes

- **TypeScript**: Strict mode enabled; uses `@/*` path alias for `src/`
- **Next.js**: App Router with Server Components by default
- **Tailwind CSS**: v4 with typography plugin
- **Prisma**: Output generated to `src/generated/prisma/`
- **Environment**: `ANTHROPIC_API_KEY` is optional; without it, the mock provider is used

### Important Security & Dependency Notes

**Do NOT run `npm audit fix`** — dependencies are pinned to specific compatible versions. Running audit fix can break the app by bumping packages past compatible versions. Security updates are applied by updating the pinned versions directly in package.json. The project was recently updated to address CVE-2025-55182 / CVE-2025-66478 (React2Shell vulnerability in Next.js).

## Development Workflow

1. **Run the dev server**: `npm run dev`
2. **Make changes** to TypeScript/React files (with hot reload via Turbopack)
3. **Run tests** as needed: `npm test`
4. **Test the UI** in the browser at http://localhost:3000
5. **Database migrations**: Use `npx prisma migrate dev` if schema changes; use `npm run db:reset` to start fresh

## Key Files & Their Purpose

| Path | Purpose |
|------|---------|
| `src/app/page.tsx` | Home/landing page (auth or chat redirect) |
| `src/app/[projectId]/page.tsx` | Project workspace (chat + editor + preview) |
| `src/app/api/chat/route.ts` | Streaming chat endpoint with Claude integration |
| `src/lib/file-system.ts` | Virtual file system implementation |
| `src/lib/auth.ts` | JWT session management |
| `src/lib/provider.ts` | Language model initialization (Anthropic or mock) |
| `src/lib/contexts/chat-context.tsx` | Global chat state management |
| `src/lib/contexts/file-system-context.tsx` | Global file system state |
| `prisma/schema.prisma` | Database schema (User, Project) |
