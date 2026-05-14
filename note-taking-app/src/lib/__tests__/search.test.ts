import { searchByTags } from '../search';
import type { Note } from '../../types/notes';

describe('searchByTags', () => {
  const mockNotes: Note[] = [
    {
      id: '1',
      path: '/1.md',
      title: 'Note 1',
      content: 'Content 1',
      frontmatter: {},
      tags: ['typescript', 'react'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      path: '/2.md',
      title: 'Note 2',
      content: 'Content 2',
      frontmatter: {},
      tags: ['javascript', 'react'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      path: '/3.md',
      title: 'Note 3',
      content: 'Content 3',
      frontmatter: {},
      tags: ['python', 'backend'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '4',
      path: '/4.md',
      title: 'Note 4',
      content: 'Content 4',
      frontmatter: {},
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  it('should return notes that match at least one of the tags', () => {
    const result = searchByTags(mockNotes, ['react']);
    expect(result).toHaveLength(2);
    expect(result.map(n => n.id)).toEqual(['1', '2']);
  });

  it('should return notes matching any of multiple tags (OR logic)', () => {
    const result = searchByTags(mockNotes, ['typescript', 'python']);
    expect(result).toHaveLength(2);
    expect(result.map(n => n.id)).toEqual(['1', '3']);
  });

  it('should return empty array if no notes match the tags', () => {
    const result = searchByTags(mockNotes, ['java', 'c++']);
    expect(result).toHaveLength(0);
  });

  it('should return empty array if searching with empty tags array', () => {
    const result = searchByTags(mockNotes, []);
    expect(result).toHaveLength(0);
  });

  it('should handle empty notes array', () => {
    const result = searchByTags([], ['react']);
    expect(result).toHaveLength(0);
  });
});
