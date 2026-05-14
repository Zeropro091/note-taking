import { getAllTags } from './search';
import type { Note } from '../types/notes';

describe('getAllTags', () => {
  it('should return a map of unique tags with their counts', () => {
    const mockNotes = [
      { id: '1', tags: ['javascript', 'react', 'web'] },
      { id: '2', tags: ['javascript', 'nodejs'] },
      { id: '3', tags: ['react', 'css'] },
    ] as Note[];

    const result = getAllTags(mockNotes);

    expect(result.size).toBe(5);
    expect(result.get('javascript')).toBe(2);
    expect(result.get('react')).toBe(2);
    expect(result.get('web')).toBe(1);
    expect(result.get('nodejs')).toBe(1);
    expect(result.get('css')).toBe(1);
  });

  it('should handle notes with empty tags arrays', () => {
    const mockNotes = [
      { id: '1', tags: ['javascript'] },
      { id: '2', tags: [] },
      { id: '3', tags: ['javascript'] },
    ] as Note[];

    const result = getAllTags(mockNotes);

    expect(result.size).toBe(1);
    expect(result.get('javascript')).toBe(2);
  });

  it('should return an empty map when given an empty array of notes', () => {
    const result = getAllTags([]);
    expect(result.size).toBe(0);
  });
});
