---
title: Welcome to Note Taking App
tags:
  - getting-started
  - guide
created: 2026-04-11T00:00:00.000Z
updated: 2026-04-11T00:00:00.000Z
---

# Welcome to Note Taking App

A powerful note-taking application with Obsidian-like features and AI agent integration.

## Features

- **Markdown Editor** - Write notes in markdown with live preview
- **Graph View** - Visualize connections between your notes
- **Backlinks** - See which notes link to the current note
- **Tags** - Organize notes with tags
- **AI API** - REST endpoints for AI agents to query and manipulate notes
- **Local Files** - Your notes are stored as plain markdown files

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `⌘K` / `Ctrl+K` | Quick switcher - search and jump to notes |
| `⌘S` / `Ctrl+S` | Save current note |
| `⌘E` / `Ctrl+E` | Edit mode |
| `⌘P` / `Ctrl+P` | Preview mode |
| `⌘\` / `Ctrl+\` | Split view |

## Wikilinks

Link to other notes using `[[Note Name]]` syntax. For example:

- [[Getting Started]]
- [[Features]]
- [[JayamAirways-Profile]] - Your complete technical profile
- [[Ideas-Projects-Complete]] - All your ideas and projects portfolio

Try creating a new note and linking to it!

## AI API Integration

This app includes a REST API designed for AI agents. Endpoints include:

- `GET /api/ai/notes` - List all notes
- `GET /api/ai/notes/:id` - Get a specific note with context
- `POST /api/ai/search` - Semantic search
- `GET /api/ai/graph` - Get knowledge graph structure

Example:
```bash
curl http://localhost:3000/api/ai/notes
```

## Getting Started

1. Click **New** to create your first note
2. Write in markdown using the editor
3. Use `[[wikilinks]]` to connect notes
4. View the **Graph** to see relationships
5. Check **Backlinks** to see incoming links

Happy note-taking!
