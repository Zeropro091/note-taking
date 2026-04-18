// Note types and interfaces

export interface NoteFrontmatter {
  title?: string;
  tags?: string[];
  created?: string;
  updated?: string;
  [key: string]: any;
}

export interface Note {
  id: string;
  path: string;
  title: string;
  content: string;
  frontmatter: NoteFrontmatter;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Wikilink {
  target: string;
  start: number;
  end: number;
}

export interface GraphNode {
  id: string;
  label: string;
  tags: string[];
  path: string;
}

export interface GraphEdge {
  source: string;
  target: string;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Backlink {
  noteId: string;
  title: string;
  excerpt: string;
}

export interface SearchResult {
  note: Note;
  score: number;
  snippet: string;
  matches: {
    field: 'title' | 'content' | 'tags';
    text: string;
  }[];
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  children?: FileNode[];
}
