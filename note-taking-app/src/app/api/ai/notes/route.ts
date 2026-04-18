// AI API route for listing notes (optimized for AI agents)
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';

export const runtime = 'nodejs';

// GET /api/ai/notes - List all notes (lightweight for AI context)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const includeContent = searchParams.get('content') === 'true';

    const notes = await getAllNotes();

    // Lightweight format for AI agents
    const lightweightNotes = notes.map((note) => ({
      id: note.id,
      title: note.title,
      path: note.path,
      tags: note.tags,
      updatedAt: note.updatedAt.toISOString(),
      ...(includeContent && { content: note.content }),
    }));

    return NextResponse.json({
      success: true,
      notes: lightweightNotes,
      count: lightweightNotes.length,
    });
  } catch (error) {
    console.error('Error fetching notes for AI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}
