// AI API route for getting a specific note
import { NextRequest, NextResponse } from 'next/server';
import { getNoteById } from '@/lib/file-system';
import { findBacklinks, findRelatedNotes } from '@/lib/graph';
import { getAllNotes } from '@/lib/file-system';

export const runtime = 'nodejs';

// GET /api/ai/notes/[id] - Get note with context for AI
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const note = await getNoteById(id);

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      );
    }

    const { searchParams } = new URL(request.url);
    const includeBacklinks = searchParams.get('backlinks') !== 'false';
    const includeRelated = searchParams.get('related') === 'true';

    const response: any = {
      success: true,
      note: {
        id: note.id,
        title: note.title,
        content: note.content,
        frontmatter: note.frontmatter,
        tags: note.tags,
        path: note.path,
        updatedAt: note.updatedAt.toISOString(),
      },
    };

    if (includeBacklinks) {
      const notes = await getAllNotes();
      const backlinks = findBacklinks(id, notes);
      response.backlinks = backlinks;
    }

    if (includeRelated) {
      const notes = await getAllNotes();
      const related = findRelatedNotes(id, notes, 5);
      response.related = related.map((n) => ({
        id: n.id,
        title: n.title,
        tags: n.tags,
      }));
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching note for AI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    );
  }
}

// POST /api/ai/notes/[id] - AI agent creates/updates a note
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { content, frontmatter, create = false } = body;

    // Import saveNote function
    const { saveNote } = await import('@/lib/file-system');

    const note = await saveNote(id, content, frontmatter);

    return NextResponse.json({
      success: true,
      note: {
        id: note.id,
        title: note.title,
        path: note.path,
      },
    });
  } catch (error) {
    console.error('Error saving note from AI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to save note' },
      { status: 500 }
    );
  }
}
