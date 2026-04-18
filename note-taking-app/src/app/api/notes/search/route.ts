// API route for searching notes
import { NextRequest, NextResponse } from 'next/server';
import { getAllNotes } from '@/lib/file-system';
import { searchNotes, quickSwitch } from '@/lib/search';

export const runtime = 'nodejs';

// POST /api/notes/search - Search notes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 10, mode = 'full' } = body;

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const notes = await getAllNotes();

    if (mode === 'quick') {
      const results = quickSwitch(notes, query, limit);
      return NextResponse.json({
        success: true,
        results: results.map((note) => ({ note })),
      });
    }

    const results = searchNotes(notes, query, limit);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error searching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search notes' },
      { status: 500 }
    );
  }
}

// GET /api/notes/search?query=... - Quick search via GET
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const mode = searchParams.get('mode') || 'full';

    if (!query) {
      return NextResponse.json(
        { success: false, error: 'Query is required' },
        { status: 400 }
      );
    }

    const notes = await getAllNotes();

    if (mode === 'quick') {
      const results = quickSwitch(notes, query, limit);
      return NextResponse.json({
        success: true,
        results: results.map((note) => ({ note })),
      });
    }

    const results = searchNotes(notes, query, limit);

    return NextResponse.json({
      success: true,
      results,
    });
  } catch (error) {
    console.error('Error searching notes:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search notes' },
      { status: 500 }
    );
  }
}
