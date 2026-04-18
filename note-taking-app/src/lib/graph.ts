// Graph utilities for building note connection graph
import type { Note, GraphData, GraphNode, GraphEdge, Backlink } from '@/types/notes';
import { extractWikilinks } from './markdown';

// Build graph data from notes
export function buildGraph(notes: Note[]): GraphData {
  const nodes: GraphNode[] = notes.map((note) => ({
    id: note.id,
    label: note.title,
    tags: note.tags,
    path: note.path,
  }));

  const edges: GraphEdge[] = [];
  const edgeKeySet = new Set<string>();

  // Helper to add edge without duplicates
  const addEdge = (source: string, target: string) => {
    if (source === target) return;
    const key = [source, target].sort().join('|');
    if (edgeKeySet.has(key)) return;
    edgeKeySet.add(key);
    edges.push({ source, target });
  };

  // 1. Add connections from wikilinks in content
  for (const note of notes) {
    const links = extractWikilinks(note.content);

    for (const link of links) {
      const targetNote = notes.find(
        (n) => n.id === link.target || n.id === `${link.target}.md` || n.path === link.target
      );

      if (targetNote) {
        addEdge(note.id, targetNote.id);
      }
    }
  }

  // 2. Add connections based on shared tags (optimized)
  const notesByTag = new Map<string, string[]>();
  for (const note of notes) {
    for (const tag of note.tags || []) {
      if (!notesByTag.has(tag)) {
        notesByTag.set(tag, []);
      }
      notesByTag.get(tag)!.push(note.id);
    }
  }

  // Connect notes that share SPECIFIC tags (not generic ones)
  // Skip overly common tags that create too many connections
  const commonTags = new Set(['project', 'business', 'tech', 'ai', 'saas', 'app', 'digital']);

  for (const [tag, noteIds] of notesByTag.entries()) {
    // Skip if tag is too common or has too many notes
    if (commonTags.has(tag) || noteIds.length > 10) continue;

    // Connect notes with the same specific tag (max 5 connections per tag)
    for (let i = 0; i < Math.min(noteIds.length, 6); i++) {
      for (let j = i + 1; j < Math.min(noteIds.length, 6); j++) {
        addEdge(noteIds[i], noteIds[j]);
      }
    }
  }

  // 3. Add category-based connections (for project and business ideas) - optimized
  const projectIdeas = notes.filter(n => n.id.startsWith('project-Idea-'));
  const businessIdeas = notes.filter(n => n.id.startsWith('business-Idea-'));

  // Connect project ideas with shared themes (limit connections)
  const projectThemes = new Map<string, string[]>();
  for (const note of projectIdeas) {
    const themes = extractThemes(note);
    for (const theme of themes) {
      if (!projectThemes.has(theme)) {
        projectThemes.set(theme, []);
      }
      projectThemes.get(theme)!.push(note.id);
    }
  }

  // Only connect projects within same theme if theme is rare enough (max 5 notes)
  for (const [theme, noteIds] of projectThemes.entries()) {
    if (noteIds.length > 5) continue; // Skip crowded themes
    for (let i = 0; i < noteIds.length; i++) {
      for (let j = i + 1; j < noteIds.length; j++) {
        addEdge(noteIds[i], noteIds[j]);
      }
    }
  }

  // Connect business ideas with shared themes (limit connections)
  const businessThemes = new Map<string, string[]>();
  for (const note of businessIdeas) {
    const themes = extractThemes(note);
    for (const theme of themes) {
      if (!businessThemes.has(theme)) {
        businessThemes.set(theme, []);
      }
      businessThemes.get(theme)!.push(note.id);
    }
  }

  // Only connect businesses within same theme if theme is rare enough (max 5 notes)
  for (const [theme, noteIds] of businessThemes.entries()) {
    if (noteIds.length > 5) continue; // Skip crowded themes
    for (let i = 0; i < noteIds.length; i++) {
      for (let j = i + 1; j < noteIds.length; j++) {
        addEdge(noteIds[i], noteIds[j]);
      }
    }
  }

  // 4. Connect related project-business pairs (limit to prevent explosion)
  const categoryMap = new Map<string, { projects: string[]; businesses: string[] }>();
  for (const note of projectIdeas) {
    const category = categorizeNote(note);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, { projects: [], businesses: [] });
    }
    categoryMap.get(category)!.projects.push(note.id);
  }
  for (const note of businessIdeas) {
    const category = categorizeNote(note);
    if (!categoryMap.has(category)) {
      categoryMap.set(category, { projects: [], businesses: [] });
    }
    categoryMap.get(category)!.businesses.push(note.id);
  }

  // Connect projects to businesses in same category (limit per category)
  for (const [_, { projects, businesses }] of categoryMap.entries()) {
    // Limit connections per category to prevent explosion
    const maxConnections = Math.min(projects.length * businesses.length, 20);
    let connections = 0;
    for (const project of projects) {
      for (const business of businesses) {
        if (connections >= maxConnections) break;
        addEdge(project, business);
        connections++;
      }
      if (connections >= maxConnections) break;
    }
  }

  return { nodes, edges };
}

// Extract themes/keywords from note content and title
function extractThemes(note: Note): string[] {
  const themes: string[] = [];
  const text = (note.title + ' ' + note.content).toLowerCase();

  // Common theme keywords
  const themeKeywords = [
    'ai', 'automation', 'saas', 'ecommerce', 'mobile', 'web',
    'health', 'fitness', 'finance', 'education', 'food', 'travel',
    'social', 'marketing', 'productivity', 'developer', 'design',
    'local', 'service', 'content', 'video', 'audio', 'writing',
    'selling', 'sales', 'business', 'startup', 'passive', 'income'
  ];

  for (const keyword of themeKeywords) {
    if (text.includes(keyword)) {
      themes.push(keyword);
    }
  }

  return themes;
}

// Categorize note based on content
function categorizeNote(note: Note): string {
  const text = (note.title + ' ' + note.content).toLowerCase();

  if (text.includes('ai') || text.includes('automation') || text.includes('code')) return 'tech';
  if (text.includes('ecommerce') || text.includes('dropshipping') || text.includes('store')) return 'ecommerce';
  if (text.includes('health') || text.includes('fitness') || text.includes('wellness')) return 'health';
  if (text.includes('finance') || text.includes('budget') || text.includes('investing')) return 'finance';
  if (text.includes('education') || text.includes('learn') || text.includes('teach')) return 'education';
  if (text.includes('food') || text.includes('meal') || text.includes('recipe')) return 'food';
  if (text.includes('service') || text.includes('cleaning') || text.includes('local')) return 'services';
  if (text.includes('social') || text.includes('media') || text.includes('content')) return 'media';
  if (text.includes('marketing') || text.includes('selling') || text.includes('sales')) return 'sales';
  if (text.includes('app') || text.includes('mobile') || text.includes('web')) return 'apps';

  return 'general';
}

// Find backlinks to a note
export function findBacklinks(noteId: string, notes: Note[]): Backlink[] {
  const backlinks: Backlink[] = [];
  const targetNote = notes.find((n) => n.id === noteId);

  if (!targetNote) return backlinks;

  for (const note of notes) {
    if (note.id === noteId) continue;

    const links = extractWikilinks(note.content);

    for (const link of links) {
      if (
        link.target === noteId ||
        link.target === `${noteId}.md` ||
        link.target === targetNote.title
      ) {
        // Find the context around the link
        const linkStart = Math.max(0, link.start - 50);
        const linkEnd = Math.min(note.content.length, link.end + 50);
        const excerpt = '...' + note.content.slice(linkStart, linkEnd) + '...';

        backlinks.push({
          noteId: note.id,
          title: note.title,
          excerpt,
        });
        break; // Only add each backlink once per note
      }
    }
  }

  return backlinks;
}

// Find related notes (by shared tags, links, or folder proximity)
export function findRelatedNotes(noteId: string, notes: Note[], limit = 5): Note[] {
  const targetNote = notes.find((n) => n.id === noteId);
  if (!targetNote) return [];

  const scores = new Map<string, number>();

  for (const note of notes) {
    if (note.id === noteId) continue;

    let score = 0;

    // Shared tags
    const sharedTags = note.tags.filter((tag) => targetNote.tags.includes(tag));
    score += sharedTags.length * 2;

    // Links to target note
    const links = extractWikilinks(note.content);
    const linksToTarget = links.filter(
      (l) => l.target === noteId || l.target === `${noteId}.md`
    );
    score += linksToTarget.length * 3;

    // Same folder
    if (note.path.split('/').slice(0, -1).join('/') === targetNote.path.split('/').slice(0, -1).join('/')) {
      score += 1;
    }

    // Target links to this note
    const targetLinks = extractWikilinks(targetNote.content);
    const targetLinksToNote = targetLinks.filter(
      (l) => l.target === note.id || l.target === note.id.replace('.md', '')
    );
    score += targetLinksToNote.length * 2;

    if (score > 0) {
      scores.set(note.id, score);
    }
  }

  // Sort by score and return top results
  return Array.from(scores.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => notes.find((n) => n.id === id)!)
    .filter(Boolean);
}

// Find isolated notes (no connections)
export function findIsolatedNotes(graph: GraphData): string[] {
  const connectedIds = new Set<string>();

  for (const edge of graph.edges) {
    connectedIds.add(edge.source);
    connectedIds.add(edge.target);
  }

  return graph.nodes
    .filter((node) => !connectedIds.has(node.id))
    .map((node) => node.id);
}

// Find highly connected notes (hubs)
export function findHubNotes(graph: GraphData, threshold = 3): Array<{
  id: string;
  connections: number;
}> {
  const connectionCount = new Map<string, number>();

  for (const edge of graph.edges) {
    connectionCount.set(edge.source, (connectionCount.get(edge.source) || 0) + 1);
    connectionCount.set(edge.target, (connectionCount.get(edge.target) || 0) + 1);
  }

  return Array.from(connectionCount.entries())
    .filter(([_, count]) => count >= threshold)
    .map(([id, connections]) => ({ id, connections }))
    .sort((a, b) => b.connections - a.connections);
}

// Find shortest path between two notes (BFS)
export function findPath(fromId: string, toId: string, graph: GraphData): string[] | null {
  if (fromId === toId) return [fromId];

  const adjacency = new Map<string, string[]>();

  for (const node of graph.nodes) {
    adjacency.set(node.id, []);
  }

  for (const edge of graph.edges) {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  }

  const queue: Array<{ node: string; path: string[] }> = [
    { node: fromId, path: [fromId] }
  ];
  const visited = new Set<string>([fromId]);

  while (queue.length > 0) {
    const { node, path } = queue.shift()!;

    if (node === toId) return path;

    for (const neighbor of adjacency.get(node) || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null; // No path found
}
