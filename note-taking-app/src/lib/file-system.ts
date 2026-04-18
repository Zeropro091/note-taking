// File system utilities for markdown notes
import fs from 'fs/promises';
import path from 'path';
import { resolve } from 'path';
import matter from 'gray-matter';
import type { Note, FileNode } from '@/types/notes';

const NOTES_DIR = path.join(process.cwd(), 'data', 'notes');

/**
 * Validate note ID to prevent path traversal attacks
 * @param id - The note ID to validate
 * @returns true if valid, false otherwise
 */
function validateNoteId(id: string): boolean {
  // Reject empty IDs
  if (!id || typeof id !== 'string') {
    return false;
  }

  // Remove any directory traversal attempts and normalize
  const normalized = id.replace(/\.\./g, '').replace(/\\/g, '/');

  // Check for invalid characters (Windows/Unix filename restrictions)
  if (/[<>:"|?*\x00-\x1f]/.test(normalized)) {
    return false;
  }

  // Ensure the resolved path is within NOTES_DIR
  const resolvedPath = resolve(NOTES_DIR, `${normalized}.md`);
  return resolvedPath.startsWith(NOTES_DIR);
}

/**
 * Sanitize a note ID for safe file operations
 * @param id - The note ID to sanitize
 * @returns A sanitized ID safe for file operations
 */
function sanitizeNoteId(id: string): string {
  return id
    .replace(/\.\./g, '') // Remove parent directory references
    .replace(/\\/g, '/')   // Normalize path separators
    .replace(/[<>:"|?*\x00-\x1f]/g, ''); // Remove invalid characters
}

/**
 * Normalize tags to ensure they're always an array of strings
 * @param tags - Tags from frontmatter (can be various types)
 * @returns Array of string tags
 */
function normalizeTags(tags: any): string[] {
  if (!tags) return [];

  // If it's already an array of strings, return it
  if (Array.isArray(tags)) {
    return tags
      .filter((tag) => tag != null) // Remove null/undefined
      .map((tag) => String(tag)); // Convert everything to string
  }

  // If it's a single value, convert to array
  if (typeof tags === 'string') {
    return [tags];
  }

  // Fallback: return empty array
  return [];
}

// Ensure notes directory exists
export async function ensureNotesDir(): Promise<void> {
  try {
    await fs.access(NOTES_DIR);
  } catch {
    await fs.mkdir(NOTES_DIR, { recursive: true });
  }
}

// Read all markdown files recursively
export async function getAllNotes(): Promise<Note[]> {
  await ensureNotesDir();
  const notes: Note[] = [];

  async function walkDir(dirPath: string, relativePath = '') {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        await walkDir(fullPath, relPath);
      } else if (entry.name.endsWith('.md')) {
        const content = await fs.readFile(fullPath, 'utf-8');
        const { data, content: markdown } = matter(content);
        const stats = await fs.stat(fullPath);

        notes.push({
          id: relPath.replace(/\.md$/, ''),
          path: relPath,
          title: data.title || entry.name.replace(/\.md$/, ''),
          content: markdown,
          frontmatter: data,
          tags: normalizeTags(data.tags),
          createdAt: data.created ? new Date(data.created) : stats.birthtime,
          updatedAt: data.updated ? new Date(data.updated) : stats.mtime,
        });
      }
    }
  }

  await walkDir(NOTES_DIR);
  return notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
}

// Read a single note by ID
export async function getNoteById(id: string): Promise<Note | null> {
  // Validate ID to prevent path traversal
  if (!validateNoteId(id)) {
    throw new Error(`Invalid note ID: ${id}`);
  }

  const safeId = sanitizeNoteId(id);
  const notePath = path.join(NOTES_DIR, `${safeId}.md`);
  try {
    const content = await fs.readFile(notePath, 'utf-8');
    const { data, content: markdown } = matter(content);
    const stats = await fs.stat(notePath);

    return {
      id: safeId,
      path: `${safeId}.md`,
      title: data.title || path.basename(safeId),
      content: markdown,
      frontmatter: data,
      tags: normalizeTags(data.tags),
      createdAt: data.created ? new Date(data.created) : stats.birthtime,
      updatedAt: data.updated ? new Date(data.updated) : stats.mtime,
    };
  } catch {
    return null;
  }
}

// Create or update a note
export async function saveNote(id: string, content: string, frontmatter?: Record<string, any>): Promise<Note> {
  // Validate ID to prevent path traversal
  if (!validateNoteId(id)) {
    throw new Error(`Invalid note ID: ${id}`);
  }

  await ensureNotesDir();

  const safeId = sanitizeNoteId(id);
  const existingNote = await getNoteById(safeId);
  const now = new Date().toISOString();

  const frontmatterData = {
    ...existingNote?.frontmatter,
    ...frontmatter,
    title: frontmatter?.title || existingNote?.title || path.basename(safeId),
    updated: now,
    created: existingNote?.frontmatter?.created || now,
  };

  const markdown = matter.stringify(content, frontmatterData);
  const notePath = path.join(NOTES_DIR, `${safeId}.md`);

  await fs.mkdir(path.dirname(notePath), { recursive: true });
  await fs.writeFile(notePath, markdown, 'utf-8');

  return getNoteById(safeId) as Promise<Note>;
}

// Delete a note
export async function deleteNote(id: string): Promise<void> {
  // Validate ID to prevent path traversal
  if (!validateNoteId(id)) {
    throw new Error(`Invalid note ID: ${id}`);
  }

  const safeId = sanitizeNoteId(id);
  const notePath = path.join(NOTES_DIR, `${safeId}.md`);
  await fs.unlink(notePath);
}

// Get file tree structure
export async function getFileTree(): Promise<FileNode[]> {
  await ensureNotesDir();

  async function buildTree(dirPath: string, relativePath = ''): Promise<FileNode[]> {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });
    const nodes: FileNode[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);
      const relPath = path.join(relativePath, entry.name);

      if (entry.isDirectory()) {
        const children = await buildTree(fullPath, relPath);
        nodes.push({
          name: entry.name,
          path: relPath,
          type: 'folder',
          children,
        });
      } else if (entry.name.endsWith('.md')) {
        nodes.push({
          name: entry.name,
          path: relPath,
          type: 'file',
        });
      }
    }

    return nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }

  return buildTree(NOTES_DIR);
}

// Create a new note
export async function createNote(notePath: string, title: string): Promise<Note> {
  // Validate path to prevent path traversal
  if (!validateNoteId(notePath)) {
    throw new Error(`Invalid note path: ${notePath}`);
  }

  const now = new Date().toISOString();
  const content = `# ${title}\n\n`;
  const frontmatter = {
    title,
    tags: [],
    created: now,
    updated: now,
  };

  const safePath = sanitizeNoteId(notePath).replace(/\.md$/, '');
  return saveNote(safePath, content, frontmatter);
}

// Rename a note
export async function renameNote(oldId: string, newId: string): Promise<Note> {
  // Validate both IDs to prevent path traversal
  if (!validateNoteId(oldId) || !validateNoteId(newId)) {
    throw new Error(`Invalid note ID for rename operation`);
  }

  const safeOldId = sanitizeNoteId(oldId);
  const safeNewId = sanitizeNoteId(newId);
  const oldPath = path.join(NOTES_DIR, `${safeOldId}.md`);
  const newPath = path.join(NOTES_DIR, `${safeNewId}.md`);

  await fs.mkdir(path.dirname(newPath), { recursive: true });
  await fs.rename(oldPath, newPath);

  return getNoteById(safeNewId) as Promise<Note>;
}
