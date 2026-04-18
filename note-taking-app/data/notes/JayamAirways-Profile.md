---
title: Putu Ari Wijaya Pratama - Profile & Ideas
tags:
  - profile
  - ideas
  - projects
  - tech-stack
created: '2026-04-12T00:00:00.000Z'
updated: '2026-04-12T00:00:00.000Z'
---

# Putu Ari Wijaya Pratama - Complete Profile & Ideas
**aka: Ari, ZeroPro**

## Core Identity

15-year-old software engineer and technical founder based in Denpasar, Bali. Passionate about building intelligent systems, AI integration, and digital solutions for businesses. Combines deep technical expertise across multiple programming languages with structured, process-driven development approach.

## Technical Philosophy

### Decision-Making Principles

**Correctness First, Always**
- Code must work correctly before optimization
- Never sacrifice reliability for performance
- Test assumptions empirically, not theoretically

**Immutability as Default**
- Prefer creating new objects over mutating existing ones
- Enables safer concurrency and simpler debugging

**Small, Focused Units**
- Files: 200-400 lines typical, 800 absolute maximum
- Functions: <50 lines, single responsibility
- High cohesion, low coupling

**Planning Before Execution**
- Research existing solutions first (GitHub, package registries, docs)
- Use planner agent for complex features
- Generate architecture docs before coding

## Technology Stack Preferences

### Backend (Priority Order)
1. **Python** - FastAPI, Django (REST APIs, ML projects)
2. **Node.js/TypeScript** - Express, NestJS (Real-time, microservices)
3. **Go** - High-performance APIs, microservices
4. **Kotlin** - Spring Boot (Enterprise Java ecosystem)

### Frontend (Priority Order)
1. **React/Next.js** - General web applications
2. **Vue/Nuxt** - Progressive web applications
3. **Swift/SwiftUI** - iOS applications
4. **Kotlin/Compose** - Android applications

### Database (Priority Order)
1. **PostgreSQL** - Primary relational database
2. **SQLite** - Local development, embedded databases
3. **MongoDB** - Document storage when schema flexibility needed
4. **Redis** - Caching, sessions, pub/sub

## Development Approach

### Test-Driven Development (Non-Negotiable)
1. Write tests first (RED)
2. Implement minimal code to pass (GREEN)
3. Refactor for clarity (IMPROVE)
4. Verify 80%+ coverage

### Research & Reuse First
- Search GitHub for existing implementations before writing new code
- Consult primary vendor documentation
- Check package registries (npm, PyPI, crates.io)
- Only write net-new code when existing solutions don't meet requirements

## Active Projects

### Note-Taking App (Obsidian-like)
- **Location**: `C:/Users/JayamAirways/note-taking-app` (local development)
- **Tech Stack**: Next.js, TypeScript, Tailwind CSS, Monaco Editor
- **Features**:
  - Markdown editor with live preview
  - Graph view for note connections
  - Backlinks and wikilinks (`[[Note Name]]`)
  - AI API endpoints for agent integration
- **Status**: Development server on port 3001

### Tech Stack Research & Knowledge Maintenance
- **Status**: Active
- **Focus**: Keeping current with latest technology updates
- **Methodology**: Research Scout skill with official documentation
- **Key Findings (2026-03-22)**:

#### Backend Research Highlights
- **PostgreSQL 18**: Asynchronous I/O subsystem - game-changing for I/O-bound workloads
- **Django 5.1**: Full async support narrows gap with FastAPI
- **FastAPI 0.115+**: Production-ready Server-Sent Events with built-in best practices
- **Spring Boot 4.0**: First-class Kotlin support with coroutines and WebFlux
- **Go 1.23**: Improved garbage collection with hybrid write barrier

#### Frontend Research Highlights
- **React 19**: Stable Server Components and new `use()` hook for promises
- **Next.js 16**: Stable Partial Prerendering with `cacheComponents` config
- **TypeScript 5.8**: Enhanced return type checking in conditional expressions
- **Vue 3.4+**: Computed property stability optimizations
- **SwiftUI iOS 18**: `@Observable` macro replaces `ObservableObject`
- **Jetpack Compose**: Stability critical for performance; keys essential for lazy layouts

## Automation Systems

### Memory & Knowledge Systems

**Three-tier Memory Architecture**:
- `recent-memory.md` - Rolling 48-hour context
- `long-term-memory.md` - Stable patterns and validated facts
- `project-memory.md` - Active project state and current work

**Nightly Consolidation**: 2:00 AM via `/consolidate-memory` skill

**Morning Briefing**: 8:57 AM daily
- Reads memory, checks active todos
- Summarizes recent work, generates 3 priorities
- Sends to Slack via webhook (pending setup)

### Agent Orchestration

**Specialized Agents** (located in `~/.claude/agents/`):
- `planner` - Implementation planning for complex features
- `architect` - System design and architectural decisions
- `tdd-guide` - Test-driven development enforcement
- `code-reviewer` - Code review after writing code
- `security-reviewer` - Security analysis before commits
- `build-error-resolver` - Fix build errors
- `e2e-runner` - End-to-end testing
- `refactor-cleaner` - Dead code cleanup
- `doc-updater` - Documentation updates

**Parallel Execution Strategy**: Always launch independent agents in parallel

## Communication Style

### Preferences
- Concise but complete responses
- Include file paths with line numbers for navigation
- No emojis unless explicitly requested
- Evidence-based with specific references
- Educational insights with "★ Insight" sections

### Learning Style
- Appreciates understanding both "what changed" and "why it matters"
- Values comparison with previous understanding
- Likes concrete examples and code snippets
- Wants high/medium/low confidence ratings for findings

## Ideas for Future Work

### Migration Guides
- Create: React 18 → React 19 (use() hook, Server Components)
- Create: Next.js 14 → Next.js 16 (PPR, cacheComponents)
- Create: PostgreSQL 16 → PostgreSQL 18 (AIO subsystem)

### Documentation Projects
- Document decision tree: When to use Django vs FastAPI
- Document decision tree: Server Components vs Client Components in React 19
- Update CLAUDE.md with React 19 and Next.js 16 patterns
- Update CLAUDE.md with SwiftUI @Observable and Compose stability

### Performance Optimization
- Create performance optimization guides for Compose (stability, keys, immutability)
- Document SSE use cases for FastAPI (unidirectional real-time updates)

### Monitoring & Research
- Monitor Next.js 16.x for Server Actions + PPR regression fix
- Weekly review scheduled for Sunday 9 PM to promote findings

## Quality Standards

### Non-Negotiable Requirements (Before Any Commit)
- No hardcoded secrets (API keys, passwords, tokens)
- All user inputs validated at system boundaries
- SQL injection prevention (parameterized queries only)
- XSS prevention (sanitized HTML output)
- CSRF protection enabled
- Authentication/authorization verified on protected endpoints
- Rate limiting on all public endpoints
- Error messages don't leak sensitive data
- 80%+ test coverage
- Code review completed

### Git Workflow
- **Commit Format**: `<type>: <description>`
- **Types**: feat, fix, refactor, docs, test, chore, perf, ci
- **Branch Strategy**: feature/, bugfix/, hotfix/ prefixes
- **Pull Requests**: Required for all changes to main/master

## API Design Patterns

### REST API Standards
- **Route Pattern**: `/api/v1/resource` (versioned APIs)
- **Response Format**: Consistent envelope
  ```json
  {
    "success": true,
    "data": {...},
    "error": null,
    "metadata": {...}
  }
  ```

### Error Handling
- **User-Facing**: Clear, actionable error messages
- **Server-Side**: Detailed error context in logs
- **HTTP Status Codes**: Use appropriate codes (400, 401, 403, 404, 500, etc.)

## File Organization

### Project Structure
```
project/
├── src/              # Source code
├── tests/            # Test files (mirror src structure)
├── docs/             # Documentation
├── scripts/          # Build/deployment scripts
└── config/           # Configuration files
```

### Naming Conventions
- **Files**: kebab-case for utilities, PascalCase for components/classes
- **Directories**: kebab-case
- **Variables/Functions**: camelCase (JavaScript/TypeScript), snake_case (Python)
- **Constants**: UPPER_SNAKE_CASE
- **Private**: _prefix (Python), #prefix (JavaScript/TypeScript private fields)

## Key System Locations

- **Memory**: `~/.claude/projects/C--Users-JayamAirways/memory/`
- **Skills**: `~/.claude/skills/`
- **Agents**: `~/.claude/agents/`
- **Rules**: `~/.claude/rules/`
- **Settings**: `~/.claude/settings.json`
- **Sessions**: `~/.claude/sessions/`

## Related Notes

- [[Ideas-Projects-Complete]] - Complete portfolio of 27+ ideas, active projects, and business entities
- [[Welcome]] - Note-taking app documentation

---

*Last Updated: 2026-04-12*
*Auto-generated from memory system*
