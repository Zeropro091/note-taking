import { describe, it, expect } from 'vitest';
import { searchNotes } from './search';
import type { Note } from '@/types/notes';

// Mock data
const mockNotes: Note[] = [
  {
    id: '1',
    path: 'note1.md',
    title: 'React Fundamentals',
    content: 'React is a JavaScript library for building user interfaces. It uses a virtual DOM.',
    frontmatter: {},
    tags: ['react', 'javascript', 'frontend'],
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date('2023-01-02'),
  },
  {
    id: '2',
    path: 'note2.md',
    title: 'Advanced TypeScript',
    content: 'TypeScript adds static typing to JavaScript. It helps catch errors early during development.',
    frontmatter: {},
    tags: ['typescript', 'javascript'],
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-06'),
  },
  {
    id: '3',
    path: 'note3.md',
    title: 'Testing Strategies',
    content: 'Unit testing, integration testing, and end-to-end testing are important. Vitest is a great runner.',
    frontmatter: {},
    tags: ['testing', 'vitest'],
    createdAt: new Date('2023-01-10'),
    updatedAt: new Date('2023-01-11'),
  },
  {
    id: '4',
    path: 'note4.md',
    title: 'JavaScript Closures',
    content: 'A closure is the combination of a function bundled together with references to its surrounding state.',
    frontmatter: {},
    tags: ['javascript', 'concepts'],
    createdAt: new Date('2023-01-15'),
    updatedAt: new Date('2023-01-16'),
  },
  {
    id: '5',
    path: 'note5.md',
    title: 'Quick Note',
    content: 'Just a simple quick note with nothing special.',
    frontmatter: {},
    tags: [],
    createdAt: new Date('2023-01-20'),
    updatedAt: new Date('2023-01-21'),
  }
];

describe('searchNotes', () => {
  it('returns empty array when query is empty', () => {
    const results = searchNotes(mockNotes, '   ');
    expect(results).toEqual([]);
  });

  it('finds notes by exact title match', () => {
    const results = searchNotes(mockNotes, 'React Fundamentals');
    expect(results).toHaveLength(1);
    expect(results[0].note.id).toBe('1');
    expect(results[0].matches.some(m => m.field === 'title')).toBe(true);
  });

  it('finds notes by partial title match (fuzzy)', () => {
    const results = searchNotes(mockNotes, 'Typscript'); // intentional typo
    // Might return other weak matches, but the first one should be the target
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].note.id).toBe('2');
  });

  it('finds notes by content match', () => {
    const results = searchNotes(mockNotes, 'virtual DOM');
    expect(results).toHaveLength(1);
    expect(results[0].note.id).toBe('1');
    expect(results[0].matches.some(m => m.field === 'content')).toBe(true);
  });

  it('finds notes by tag match', () => {
    const results = searchNotes(mockNotes, 'frontend');
    expect(results).toHaveLength(1);
    expect(results[0].note.id).toBe('1');
    expect(results[0].matches.some(m => m.field === 'tags')).toBe(true);
  });

  it('orders results by relevance', () => {
    // Both note 1 and note 4 have 'javascript' tag or word
    // Note 4 has 'JavaScript' in title (weight 2)
    // Note 1 has 'JavaScript' in content (weight 1)
    // Actually Note 4 title is "JavaScript Closures"
    // Let's search for JavaScript
    const results = searchNotes(mockNotes, 'JavaScript');

    // Both notes should be found
    expect(results.length).toBeGreaterThanOrEqual(2);

    // Note 4 should be ranked higher because 'JavaScript' is in the title
    const indexNote4 = results.findIndex(r => r.note.id === '4');
    const indexNote1 = results.findIndex(r => r.note.id === '1');

    expect(indexNote4).toBeLessThan(indexNote1);
  });

  it('respects the limit parameter', () => {
    // Search for something that matches multiple notes (like 'a' or 'e')
    // 'e' appears in almost everything
    const results = searchNotes(mockNotes, 'e', 2);
    expect(results).toHaveLength(2);
  });

  it('generates an appropriate snippet', () => {
    const results = searchNotes(mockNotes, 'virtual DOM');
    expect(results).toHaveLength(1);

    // The snippet should contain the query text (or a part of it depending on how Fuse/generateSnippet handles it)
    // generateSnippet is imported and used, it finds the query text and extracts around it.
    // 'virtual DOM' -> should be in the snippet
    expect(results[0].snippet.toLowerCase()).toContain('virtual dom');
  });
});
