import { describe, it, expect } from 'vitest';
import { getRecentNotes } from '../search';
import type { Note } from '@/types/notes';

describe('getRecentNotes', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      path: '/note1',
      title: 'Note 1',
      content: 'Content 1',
      frontmatter: {},
      tags: [],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date('2023-01-05'),
    },
    {
      id: '2',
      path: '/note2',
      title: 'Note 2',
      content: 'Content 2',
      frontmatter: {},
      tags: [],
      createdAt: new Date('2023-01-02'),
      updatedAt: new Date('2023-01-08'),
    },
    {
      id: '3',
      path: '/note3',
      title: 'Note 3',
      content: 'Content 3',
      frontmatter: {},
      tags: [],
      createdAt: new Date('2023-01-03'),
      updatedAt: new Date('2023-01-02'),
    },
    {
      id: '4',
      path: '/note4',
      title: 'Note 4',
      content: 'Content 4',
      frontmatter: {},
      tags: [],
      createdAt: new Date('2023-01-04'),
      updatedAt: new Date('2023-01-10'),
    },
  ];

  it('returns notes sorted by updatedAt in descending order', () => {
    const result = getRecentNotes(mockNotes, 4);
    expect(result.length).toBe(4);
    expect(result[0].id).toBe('4'); // 2023-01-10
    expect(result[1].id).toBe('2'); // 2023-01-08
    expect(result[2].id).toBe('1'); // 2023-01-05
    expect(result[3].id).toBe('3'); // 2023-01-02
  });

  it('respects the default limit of 10', () => {
    // Generate 12 notes
    const manyNotes: Note[] = Array.from({ length: 12 }).map((_, i) => ({
      id: String(i),
      path: `/note${i}`,
      title: `Note ${i}`,
      content: `Content ${i}`,
      frontmatter: {},
      tags: [],
      createdAt: new Date('2023-01-01'),
      updatedAt: new Date(2023, 0, i + 1), // increasing date
    }));

    const result = getRecentNotes(manyNotes);
    expect(result.length).toBe(10);
    // Should contain the 10 most recent (highest dates)
    expect(result[0].id).toBe('11');
    expect(result[9].id).toBe('2');
  });

  it('respects the provided custom limit', () => {
    const result = getRecentNotes(mockNotes, 2);
    expect(result.length).toBe(2);
    expect(result[0].id).toBe('4');
    expect(result[1].id).toBe('2');
  });

  it('handles an empty list of notes', () => {
    const result = getRecentNotes([]);
    expect(result).toEqual([]);
  });

  it('handles a list of notes smaller than the limit', () => {
    const result = getRecentNotes(mockNotes, 10);
    expect(result.length).toBe(4);
  });

  it('ensures the original array is not mutated', () => {
    const originalNotes = [...mockNotes];
    getRecentNotes(originalNotes, 2);
    // Order of original should be preserved
    expect(originalNotes[0].id).toBe('1');
    expect(originalNotes[1].id).toBe('2');
    expect(originalNotes[2].id).toBe('3');
    expect(originalNotes[3].id).toBe('4');
  });
});
