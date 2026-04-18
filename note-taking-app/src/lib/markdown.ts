// Markdown parsing utilities
import type { Wikilink } from '@/types/notes';

// Wikilink regex: [[note-name]] or [[note-name|display text]]
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

// Extract all wikilinks from markdown content
export function extractWikilinks(content: string): Wikilink[] {
  const links: Wikilink[] = [];
  let match;

  while ((match = WIKILINK_REGEX.exec(content)) !== null) {
    links.push({
      target: match[1].trim(),
      start: match.index,
      end: match.index + match[0].length,
    });
  }

  return links;
}

// Replace wikilinks with markdown links for rendering
export function replaceWikilinks(content: string, currentNoteId: string): string {
  return content.replace(WIKILINK_REGEX, (match, target, display) => {
    const linkTarget = target.endsWith('.md') ? target : `${target}.md`;
    const text = display || target;
    return `[${text}](/${linkTarget})`;
  });
}

// Extract headings from markdown content
export function extractHeadings(content: string): Array<{
  level: number;
  text: string;
  id: string;
  line: number;
}> {
  const headings: Array<{ level: number; text: string; id: string; line: number }> = [];
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const match = line.match(/^(#{1,6})\s+(.+)$/);

    if (match) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');

      headings.push({ level, text, id, line: i + 1 });
    }
  }

  return headings;
}

// Generate a snippet from content around search terms
export function generateSnippet(content: string, query: string, maxLength = 200): string {
  const cleanContent = content.replace(/[#*`_\[\]]/g, ' ').replace(/\s+/g, ' ').trim();
  const lowerContent = cleanContent.toLowerCase();
  const lowerQuery = query.toLowerCase();

  const index = lowerContent.indexOf(lowerQuery);

  if (index === -1) {
    return cleanContent.slice(0, maxLength) + (cleanContent.length > maxLength ? '...' : '');
  }

  const start = Math.max(0, index - 50);
  const end = Math.min(cleanContent.length, index + query.length + 50);

  let snippet = cleanContent.slice(start, end);

  if (start > 0) snippet = '...' + snippet;
  if (end < cleanContent.length) snippet = snippet + '...';

  return snippet;
}

// Strip markdown for preview
export function stripMarkdown(content: string, maxLength = 200): string {
  return content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, '$2')
    .replace(/^\s*[-*+]\s/gm, '')
    .replace(/^\s*\d+\.\s/gm, '')
    .replace(/\n+/g, ' ')
    .trim()
    .slice(0, maxLength);
}
