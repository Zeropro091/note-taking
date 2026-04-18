// AI API route for finding related notes
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { findRelatedNotes } from '@/lib/graph';

export const runtime = 'nodejs';

// GET /api/ai/notes/[id]/related - Find related notes for context
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const notes = await getAllNotes();
    const related = findRelatedNotes(id, notes, limit);

    return NextResponse.json({
      success: true,
      related: related.map((note) => ({
        id: note.id,
        title: note.title,
        tags: note.tags,
        path: note.path,
      })),
    });
  } catch (error) {
    console.error('Error finding related notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to find related notes' },
      { status: 500 }
    );
  }
}
