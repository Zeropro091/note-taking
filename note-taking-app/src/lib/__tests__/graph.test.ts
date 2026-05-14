import { describe, it, expect } from 'vitest';
import { findBacklinks } from '../graph';
import type { Note } from '@/types/notes';

// Helper to create mock notes
function createMockNote(overrides: Partial<Note>): Note {
  return {
    id: 'default-id',
    path: 'default/path.md',
    title: 'Default Title',
    content: 'Default content',
    frontmatter: {},
    tags: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
}

describe('findBacklinks', () => {
  it('should return empty array if target note is not found', () => {
    const notes: Note[] = [
      createMockNote({ id: 'note-1', content: 'Some content' }),
    ];

    const result = findBacklinks('non-existent-id', notes);
    expect(result).toEqual([]);
  });

  it('should return empty array if no other notes link to the target note', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
    const otherNote = createMockNote({ id: 'note-1', content: 'No links here' });

    const result = findBacklinks('target-id', [targetNote, otherNote]);
    expect(result).toEqual([]);
  });

  it('should find a backlink by exact note ID', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
    const linkingNote = createMockNote({
      id: 'linking-note',
      title: 'Linking Note',
      content: 'Here is a link to [[target-id]] in the middle of a sentence.'
    });

    const result = findBacklinks('target-id', [targetNote, linkingNote]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual({
      noteId: 'linking-note',
      title: 'Linking Note',
      excerpt: '...Here is a link to [[target-id]] in the middle of a sentence....',
    });
  });

  it('should find a backlink by note ID with .md extension', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
    const linkingNote = createMockNote({
      id: 'linking-note',
      title: 'Linking Note',
      content: 'Link with extension: [[target-id.md]].'
    });

    const result = findBacklinks('target-id', [targetNote, linkingNote]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({
      noteId: 'linking-note',
    }));
  });

  it('should find a backlink by target note title', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note Title' });
    const linkingNote = createMockNote({
      id: 'linking-note',
      title: 'Linking Note',
      content: 'Link by title: [[Target Note Title]].'
    });

    const result = findBacklinks('target-id', [targetNote, linkingNote]);

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(expect.objectContaining({
      noteId: 'linking-note',
    }));
  });

  it('should only return one backlink per note, even with multiple links', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
    const linkingNote = createMockNote({
      id: 'linking-note',
      title: 'Linking Note',
      content: 'First link [[target-id]]. Second link [[Target Note]]. Third link [[target-id.md]].'
    });

    const result = findBacklinks('target-id', [targetNote, linkingNote]);

    expect(result).toHaveLength(1); // Should only have one backlink from this note
    expect(result[0]).toEqual(expect.objectContaining({
      noteId: 'linking-note',
    }));
  });

  it('should correctly handle excerpts close to the beginning or end of content', () => {
    const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
    const startLinkNote = createMockNote({
      id: 'start-note',
      content: '[[target-id]] is at the start of this short note.'
    });
    const endLinkNote = createMockNote({
      id: 'end-note',
      content: 'This note has a link at the very end to [[target-id]]'
    });

    const startResult = findBacklinks('target-id', [targetNote, startLinkNote]);
    expect(startResult).toHaveLength(1);
    expect(startResult[0].excerpt).toBe('...[[target-id]] is at the start of this short note....');

    const endResult = findBacklinks('target-id', [targetNote, endLinkNote]);
    expect(endResult).toHaveLength(1);
    expect(endResult[0].excerpt).toBe('...This note has a link at the very end to [[target-id]]...');
  });

  it('should correctly slice excerpt with long text', () => {
     const targetNote = createMockNote({ id: 'target-id', title: 'Target Note' });
     const longContent = 'A'.repeat(100) + '[[target-id]]' + 'B'.repeat(100);
     const linkingNote = createMockNote({
       id: 'linking-note',
       content: longContent
     });

     const result = findBacklinks('target-id', [targetNote, linkingNote]);

     expect(result).toHaveLength(1);
     const expectedStart = 'A'.repeat(50);
     const expectedEnd = 'B'.repeat(50);
     expect(result[0].excerpt).toBe(`...${expectedStart}[[target-id]]${expectedEnd}...`);
  });
});
