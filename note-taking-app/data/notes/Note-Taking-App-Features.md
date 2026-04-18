---
title: Note Taking App - Feature Overview
tags:
  - documentation
  - app-features
  - obsidian
created: '2026-04-12T00:00:00.000Z'
updated: '2026-04-12T00:00:00.000Z'
---

# Note Taking App - Feature Overview

## What Is This?

An Obsidian-like knowledge base built with [[Tech-Stack-Preferences]] - Next.js, TypeScript, and Monaco Editor.

## Core Features

### 📝 Markdown Editor
- **Monaco Editor** - VS Code editing experience
- **Live Preview** - See rendered markdown instantly
- **Syntax Highlighting** - Code blocks with proper highlighting
- **Auto-save** - Never lose your work

### 🔗 Wikilinks
Connect your notes using `[[Note Name]]` syntax:
- [[AI-Systems-Roadmap]]
- [[Photobooth-SaaS-Plan]]
- [[Tech-Stack-Preferences]]

### 🕸️ Graph View
- Visualize connections between notes
- See related topics at a glance
- Click nodes to navigate

### 📑 Backlinks
- See which notes link to the current note
- Discover unexpected connections

### 🏷️ Tags
Organize with tags like:
- `#ai` - AI and machine learning
- `#business` - Business ideas
- `#saas` - SaaS products

## AI Agent API

Built-in endpoints for AI agents:

```bash
# List all notes
GET /api/ai/notes

# Get specific note with context
GET /api/ai/notes/:id

# Semantic search
POST /api/ai/search

# Get knowledge graph
GET /api/ai/graph

# Find related notes
GET /api/ai/notes/:id/related
```

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Quick switcher |
| `⌘S` / `Ctrl+S` | Save note |
| `⌘E` / `Ctrl+E` | Edit mode |
| `⌘P` / `Ctrl+P` | Preview mode |

## Security Improvements (2026-04-12)

See [[Bug-Report-Code-Review]] for details:
- ✅ Path traversal protection
- ✅ XSS prevention in markdown
- ✅ Input validation on all APIs

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Editor**: Monaco Editor (VS Code engine)
- **Markdown**: react-markdown, remark-gfm, rehype-sanitize
- **Graph**: react-force-graph-2d
- **Storage**: Local markdown files

## Future Roadmap

See [[AI-Systems-Roadmap]] for the broader vision.

### Planned Features
- [ ] Real-time collaboration
- [ ] Mobile apps (iOS/Android)
- [ ] AI-powered suggestions
- [ ] Voice notes
- [ ] Image uploads with OCR
- [ ] Export to PDF/Docx

## Related Notes

- [[Welcome]] - Getting started guide
- [[JayamAirways-Profile]] - Your profile
