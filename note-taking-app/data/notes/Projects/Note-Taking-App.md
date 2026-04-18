---
title: "Note-Taking App"
tags: [project, active, web-app]
category: project
status: in-progress
priority: high
tech_stack: [Next.js, React, ForceGraph, TypeScript]
created: 2026-04-10
deadline: 2026-04-30
---

# Note-Taking App 📝

## Brief & Scope

**Objective**: Build a web-based note-taking application with graph visualization for exploring connections between notes.

**Core Features**:
- [x] Markdown note creation and editing
- [x] Graph visualization with ForceGraph2D
- [x] Smart note connections (by tags, themes, categories)
- [x] Note grouping by category
- [x] Click node to view note details
- [x] Dynamic node spacing
- [ ] Real-time collaboration
- [ ] Search functionality
- [ ] Export/Import notes
- [ ] Dark mode toggle

**MVP Definition**: Users can create, edit, and view notes with graph-based exploration of connections.

## Tech Stack

- **Frontend**: Next.js 15, React 19
- **Language**: TypeScript
- **Visualization**: react-force-graph-2d
- **Styling**: Tailwind CSS
- **Data Storage**: File-based (Markdown with frontmatter)
- **Deployment**: Vercel (ready)

## Ship Deadline

**Target**: 2026-04-30

**MVP Complete**: ~70%
- Core note CRUD: ✅
- Graph visualization: ✅
- Smart connections: ✅
- Polish & deployment: 🔄

## Status Log

### 2026-04-12
- ✅ Created 50 idea notes (25 project + 25 business)
- ✅ Enhanced graph: clickable nodes show note details
- ✅ Fixed over-connected graph (optimized from 1832 to reasonable connections)
- ✅ Added dynamic node spacing for better visualization
- ✅ Created knowledge base templates and structure
- 🔄 Next: Testing, deployment preparation

### 2026-04-10
- ✅ Initial project setup
- ✅ Basic note CRUD API
- ✅ ForceGraph2D integration
- ✅ Note grouping by category

## Blockers

1. **Search functionality** - Need to implement full-text search
2. **Real-time sync** - Considering WebSocket implementation
3. **Note editing** - Current editor is basic, need WYSIWYG

## Next Steps (Priority)

1. [ ] Implement search with filters
2. [ ] Add note editing UI improvements
3. [ ] Deploy to production
4. [ ] User testing and feedback
5. [ ] Documentation

## Anti-PBS Rule

**Current status**: ACTIVE project
**Rule**: No new projects until MVP ships (2026-04-30)

---
*Last updated: 2026-04-12*
