import { replaceWikilinks } from './markdown';

describe('replaceWikilinks', () => {
  it('should replace a wikilink with a markdown link', () => {
    const result = replaceWikilinks('This is a [[test-note]]', 'current');
    expect(result).toBe('This is a [test-note](/test-note.md)');
  });

  it('should replace a wikilink that already ends with .md', () => {
    const result = replaceWikilinks('This is a [[test-note.md]]', 'current');
    expect(result).toBe('This is a [test-note.md](/test-note.md)');
  });

  it('should handle display text in a wikilink', () => {
    const result = replaceWikilinks('This is a [[test-note|Custom Display]]', 'current');
    expect(result).toBe('This is a [Custom Display](/test-note.md)');
  });

  it('should replace multiple wikilinks in the same string', () => {
    const result = replaceWikilinks('[[note-1]] and [[note-2|Second Note]]', 'current');
    expect(result).toBe('[note-1](/note-1.md) and [Second Note](/note-2.md)');
  });

  it('should not modify content without wikilinks', () => {
    const content = 'This is just regular text with [a link](https://example.com)';
    const result = replaceWikilinks(content, 'current');
    expect(result).toBe(content);
  });
});
