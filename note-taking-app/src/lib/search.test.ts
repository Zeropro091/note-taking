import { describe, it, expect } from 'vitest';
import { getOrphanNotes } from './search';
import type { Note } from '@/types/notes';

describe('getOrphanNotes', () => {
  // Helper to create a dummy note
  const createNote = (id: string): Note => ({
    id,
    path: `/${id}.md`,
    title: `Note ${id}`,
    content: `Content for ${id}`,
    frontmatter: {},
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const noteA = createNote('a');
  const noteB = createNote('b');
  const noteC = createNote('c');
  const noteD = createNote('d');

  it('returns empty array if all notes are connected', () => {
    const notes = [noteA, noteB, noteC];
    const graph = {
      edges: [
        { source: 'a', target: 'b' },
        { source: 'b', target: 'c' },
        { source: 'c', target: 'a' },
      ],
    };

    const orphans = getOrphanNotes(notes, graph);
    expect(orphans).toEqual([]);
  });

  it('returns only orphan notes when some are linked and others are not', () => {
    const notes = [noteA, noteB, noteC, noteD];
    const graph = {
      edges: [
        { source: 'a', target: 'b' },
      ],
    };

    const orphans = getOrphanNotes(notes, graph);
    expect(orphans).toHaveLength(2);
    expect(orphans.map(n => n.id)).toEqual(['c', 'd']);
  });

  it('handles edge case with empty notes array', () => {
    const notes: Note[] = [];
    const graph = {
      edges: [
        { source: 'a', target: 'b' },
      ],
    };

    const orphans = getOrphanNotes(notes, graph);
    expect(orphans).toEqual([]);
  });

  it('handles edge case with empty graph edges', () => {
    const notes = [noteA, noteB];
    const graph = {
      edges: [],
    };

    const orphans = getOrphanNotes(notes, graph);
    expect(orphans).toHaveLength(2);
    expect(orphans.map(n => n.id)).toEqual(['a', 'b']);
  });
});
