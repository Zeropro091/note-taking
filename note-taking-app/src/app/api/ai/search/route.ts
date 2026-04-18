// AI API route for semantic search and querying
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { searchNotes } from '@/lib/search';

export const runtime = 'nodejs';

// POST /api/ai/search - AI agent searches notes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10 } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const notes = await getAllNotes();
    const results = searchNotes(notes, query, limit);

    return NextResponse.json({
      success: true,
      query,
      count: results.length,
      results: results.map((r) => ({
        note: {
          id: r.note.id,
          title: r.note.title,
          content: r.note.content,
          tags: r.note.tags,
        },
        score: r.score,
        snippet: r.snippet,
      })),
    });
  } catch (error) {
    console.error('Error in AI search:', error);
    return NextResponse.json(
      { success: false, error: 'Search failed' },
      { status: 500 }
    );
  }
}
