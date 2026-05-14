import { describe, it, expect } from 'vitest';
import { extractWikilinks } from './markdown';

describe('extractWikilinks', () => {
  it('extracts a single basic wikilink', () => {
    const content = 'This is a [[note]] linking somewhere.';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('note');
    expect(links[0].start).toBe(10);
    expect(links[0].end).toBe(18);
  });

  it('extracts a wikilink with display text', () => {
    const content = 'Check out [[note|this cool note]].';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('note');
    expect(links[0].start).toBe(10);
    expect(links[0].end).toBe(33); // "[[note|this cool note]]" is 23 chars, 10 + 23 = 33
  });

  it('extracts multiple wikilinks', () => {
    const content = 'Links to [[note1]] and [[note2|second note]] here.';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(2);
    expect(links[0].target).toBe('note1');
    expect(links[0].start).toBe(9);
    expect(links[0].end).toBe(18); // "[[note1]]" is 9 chars, 9 + 9 = 18

    expect(links[1].target).toBe('note2');
    expect(links[1].start).toBe(23);
    expect(links[1].end).toBe(44); // "[[note2|second note]]" is 21 chars, 23 + 21 = 44
  });

  it('extracts wikilinks with spaces in the target', () => {
    const content = 'A link to [[my spaced note]]';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('my spaced note');
    expect(links[0].start).toBe(10);
    expect(links[0].end).toBe(28); // "[[my spaced note]]" is 18 chars, 10 + 18 = 28
  });

  it('returns an empty array when there are no wikilinks', () => {
    const content = 'This is just a normal string with no links.';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(0);
  });

  it('returns an empty array for an empty string', () => {
    const links = extractWikilinks('');

    expect(links).toHaveLength(0);
  });

  it('handles malformed wikilinks gracefully', () => {
    const content = 'These are broken: [[]] [note]] [[note]';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(0);
  });

  it('trims whitespace around the target', () => {
    const content = 'Link with spaces [[  note  ]] inside.';
    const links = extractWikilinks(content);

    expect(links).toHaveLength(1);
    expect(links[0].target).toBe('note'); // the WIKILINK_REGEX or extractWikilinks logic trims it
  });
});
