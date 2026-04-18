// Search utilities with fuzzy matching
import Fuse from 'fuse.js';
import type { Note, SearchResult } from '@/types/notes';
import { generateSnippet } from './markdown';

// Create Fuse instance for fuzzy search
function createFuseIndex(notes: Note[]): Fuse<Note> {
  return new Fuse(notes, {
    keys: [
      { name: 'title', weight: 2 },
      { name: 'content', weight: 1 },
      { name: 'tags', weight: 1.5 },
    ],
    includeScore: true,
    includeMatches: true,
    threshold: 0.4, // Lower = more strict matching
    ignoreLocation: true,
  });
}

// Full-text search across notes
export function searchNotes(
  notes: Note[],
  query: string,
  limit = 10
): SearchResult[] {
  if (!query.trim()) return [];

  const fuse = createFuseIndex(notes);
  const results = fuse.search(query, { limit });

  return results.map((result) => {
    const note = result.item;
    const matches: SearchResult['matches'] = [];

    // Process matches to determine which fields matched
    if (result.matches) {
      for (const match of result.matches) {
        const text = match.value || '';
        matches.push({
          field: match.key as 'title' | 'content' | 'tags',
          text,
        });
      }
    }

    // Generate snippet from first content match
    const contentMatch = result.matches?.find((m) => m.key === 'content');
    const snippet = contentMatch
      ? generateSnippet(note.content, query)
      : note.content.slice(0, 150) + '...';

    return {
      note,
      score: 1 - (result.score || 0), // Convert to relevance score
      snippet,
      matches,
    };
  });
}

// Quick switcher search (title-focused)
export function quickSwitch(notes: Note[], query: string, limit = 8): Note[] {
  if (!query.trim()) return notes.slice(0, limit);

  const fuse = new Fuse(notes, {
    keys: [{ name: 'title', weight: 3 }, { name: 'path', weight: 1 }],
    threshold: 0.3,
  });

  return fuse.search(query, { limit }).map((result) => result.item);
}

// Tag search
export function searchByTags(notes: Note[], tags: string[]): Note[] {
  return notes.filter((note) =>
    tags.some((tag) => note.tags.includes(tag))
  );
}

// Get all unique tags from notes
export function getAllTags(notes: Note[]): Map<string, number> {
  const tagCounts = new Map<string, number>();

  for (const note of notes) {
    for (const tag of note.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    }
  }

  return tagCounts;
}

// Recent notes (by update time)
export function getRecentNotes(notes: Note[], limit = 10): Note[] {
  return [...notes]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, limit);
}

// Orphan notes (no backlinks)
export function getOrphanNotes(notes: Note[], graph: { edges: Array<{ source: string; target: string }> }): Note[] {
  const linkedIds = new Set<string>();

  for (const edge of graph.edges) {
    linkedIds.add(edge.source);
    linkedIds.add(edge.target);
  }

  return notes.filter((note) => !linkedIds.has(note.id));
}
