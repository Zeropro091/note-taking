import { describe, it, expect } from 'vitest';
import { generateSnippet } from './markdown';

describe('generateSnippet', () => {
  it('strips markdown characters and normalizes spaces', () => {
    const content = '# Hello *World* `code`\n\n_test_ [[link]]';
    const query = 'world';
    const snippet = generateSnippet(content, query);
    // Content should be transformed to "Hello World code test link"
    // 'world' starts at index 6. Length is 5.
    // Index: 6. Start: max(0, 6 - 50) = 0. End: min(length, 6 + 5 + 50) = 61.
    // Snippet goes to the end of string without trailing dots.
    expect(snippet).toBe('Hello World code test link');
  });

  it('generates a snippet when query is in the middle of long text', () => {
    const prefix = 'A'.repeat(100);
    const suffix = 'B'.repeat(100);
    const content = `${prefix} middle query word ${suffix}`;
    const query = 'query';
    const snippet = generateSnippet(content, query);
    // cleanContent = "A...A middle query word B...B" (100 A's, 100 B's)
    // lowerContent indexOf 'query' is 100 + 1 + 7 = 108
    // start = max(0, 108 - 50) = 58
    // end = min(length, 108 + 5 + 50) = 163
    // It should have both "..." prefixes and suffixes
    expect(snippet.startsWith('...')).toBe(true);
    expect(snippet.endsWith('...')).toBe(true);
    expect(snippet).toContain('middle query word');
  });

  it('generates a snippet when query is at the start of text', () => {
    const suffix = 'B'.repeat(100);
    const content = `start query word ${suffix}`;
    const query = 'query';
    const snippet = generateSnippet(content, query);
    // Doesn't start with ... but ends with ...
    expect(snippet.startsWith('...')).toBe(false);
    expect(snippet.endsWith('...')).toBe(true);
    expect(snippet).toContain('start query word');
  });

  it('generates a snippet when query is at the end of text', () => {
    const prefix = 'A'.repeat(100);
    const content = `${prefix} end query word`;
    const query = 'query';
    const snippet = generateSnippet(content, query);
    // Starts with ... but doesn't end with ...
    expect(snippet.startsWith('...')).toBe(true);
    expect(snippet.endsWith('...')).toBe(false);
    expect(snippet).toContain('end query word');
  });

  it('truncates content when query is not found (long text)', () => {
    const content = 'A'.repeat(300);
    const query = 'notfound';
    // default maxLength is 200
    const snippet = generateSnippet(content, query);
    expect(snippet.length).toBe(203); // 200 + 3 for "..."
    expect(snippet.endsWith('...')).toBe(true);
  });

  it('returns entire content when query is not found (short text)', () => {
    const content = 'short text';
    const query = 'notfound';
    const snippet = generateSnippet(content, query);
    expect(snippet).toBe('short text');
  });

  it('handles case insensitive searches', () => {
    const content = 'This is SOME Text for searching';
    const query = 'some TEXT';
    const snippet = generateSnippet(content, query);
    expect(snippet).toBe('This is SOME Text for searching');
  });

  it('respects custom maxLength when query not found', () => {
    const content = 'A'.repeat(100);
    const query = 'notfound';
    const snippet = generateSnippet(content, query, 50);
    expect(snippet.length).toBe(53); // 50 + "..."
    expect(snippet.endsWith('...')).toBe(true);
  });
});
